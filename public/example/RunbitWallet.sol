// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IRunbit.sol";

pragma solidity >=0.8.2 <0.9.0;

contract RunbitWallet is AccessControl {
    
    ILiquidityFound public RBFound;
    ILiquidityFound public RTFound;
    IERC20Burnable public RT;
    IRunbitCollection public RC;
    IRunbitShoes public RS;
    bool isInitialized = false;
    uint256 rate = 100000000000000;
    uint256 minPrice = 500000000000;
    uint256 minDuration = 3000;
    uint256 refRate = 80000;  // 8% x1000000
    uint256 bonusRate = 350000; // (5%+4%+3%+3%+3%+2%+9%+6%) x1000000
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant OPERATE_ROLE = keccak256("OPERATE_ROLE");
    bytes32 public constant MANAGE_ROLE = keccak256("MANAGE_ROLE");
    mapping(address => uint256) public mint_quotas;
    mapping(bytes32 => mapping(uint256 => address)) public role_accounts;
    mapping(bytes32 => uint256) public role_count;
    mapping(uint256 => uint256) public tokens;
    // dayEarnDecrease[day] = decrease
    mapping(uint256 => uint256) public dayEarnDecrease;
    mapping(uint256 => uint256) public dayEarnIncrease;
    uint256 public currentIndex;
    uint256 public currentDayEarn;
    uint256 public currentDay;
    // max RT can mint
    uint256 public maxSupply;
    uint256 public minted;
    bool public closeMint = false;
    bool public bonusClaimed = false;

    constructor(address _rs, address _rc, address _rt, address _rbs, address _rts) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGE_ROLE, msg.sender);
        RS = IRunbitShoes(_rs);
        RC = IRunbitCollection(_rc);
        RT = IERC20Burnable(_rt);
        RBFound = ILiquidityFound(_rbs);
        RTFound = ILiquidityFound(_rts);
    }

    function _set(uint256 k, uint256 v) private {
        uint256 d = k & 0xfffffffffffffffc;
        uint256 k2 = d + ((d+1) << 64) + ((d+2) << 128) + ((d+3) << 192);
        tokens[k2] += (v & 0xffffffffffffffff) << ((k & 3) * 64);
    }

    function _gets(uint256 k) private view returns (uint256) {
        uint256 d = k & 0xfffffffffffffffc;
        uint256 k2 = d + ((d+1) << 64) + ((d+2) << 128) + ((d+3) << 192);
        uint256 v = (tokens[k2] >> ((k & 3) * 64));
        return v & 0xffffffffffffffff;
    }

    function tokenEarns(uint256 tokenId) external view returns (uint256) {
        return _gets(tokenId);
    }

    function closeInitialize() external onlyRole(DEFAULT_ADMIN_ROLE) {
        isInitialized = true;
    }

    function doCloseMint() external onlyRole(DEFAULT_ADMIN_ROLE) {
        closeMint = true;
    }

    function claimFinalFund(address tech, address community) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(closeMint, "Mint is not closed!");
        require(!bonusClaimed, "already claimed!");
        uint256 techAmount = maxSupply * 9 / 100;
        uint256 communityAmount = maxSupply * 6 / 100;
        RT.mint(tech, techAmount);
        RT.mint(community, communityAmount);
        bonusClaimed = true;
    }

    function initialize(uint256 newIndex) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!isInitialized, "Can be initialized only once");
        uint256 sum = 0;
        for(uint i = currentIndex; i < newIndex; ++i) {
            uint256 tokenId = RS.tokenByIndex(i);
            IRunbitShoes.MetaData memory meta = RS.tokenMetaData(tokenId);
            uint256 earn = uint256(meta.specialty + meta.comfort + meta.aesthetic) * (meta.durability / 100) * rate;
            _set(tokenId, earn / 100000000000000);
            sum += earn + (earn * bonusRate / 1000000);
        }
        maxSupply += sum;
        currentIndex = newIndex;
        currentDay = _day();
    }

    function updateTokens(uint256 newIndex) external onlyRole(OPERATE_ROLE) {
        uint256 day = _day();
        if (currentDay > day) {
            day = currentDay;
        }
        uint256 totalSupply = RS.totalSupply();
        if (newIndex > totalSupply) {
            newIndex = totalSupply;
        }
        uint256 sumIncrease = 0;
        uint256 sumRefer = 0;
        for (uint i = currentIndex; i < newIndex; ++i) {
            uint256 tokenId = RS.tokenByIndex(i);
            if (tokenId !=0 && _gets(tokenId) == 0) {
                IRunbitShoes.MetaData memory meta = RS.tokenMetaData(tokenId);
                uint256 dayEarn = uint256(meta.specialty + meta.comfort + meta.aesthetic) * rate;
                uint256 earn = dayEarn * (meta.durability / 100);
                _set(tokenId, earn / 100000000000000);
                sumIncrease += dayEarn;
                sumRefer += earn * refRate / 1000000;
                dayEarnDecrease[day + (meta.durability / 100)] += dayEarn;
            }
        }
        maxSupply += sumRefer;
        dayEarnIncrease[day] += sumIncrease;

        currentIndex = newIndex;
    }

    function updateEarns(uint256 newDay) external onlyRole(OPERATE_ROLE) {
        uint256 day = _day();
        if (newDay > day) {
            newDay = day;
        }
        uint256 tmpDayEarn = currentDayEarn;
        uint256 sumSupply = 0;
        for (uint i = currentDay; i <= newDay; ++i) {
            tmpDayEarn += dayEarnIncrease[i];
            tmpDayEarn -= dayEarnDecrease[i];
            sumSupply += tmpDayEarn + (tmpDayEarn * bonusRate / 1000000);
        }

        currentDayEarn = tmpDayEarn;
        maxSupply += sumSupply;

        currentDay = newDay + 1;
    }
    
    // for token burn
    function restoreIndex(uint256 newIndex) external onlyRole(OPERATE_ROLE) {
        currentIndex = newIndex;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(minted + amount <= maxSupply, "Exceed max mint");
        require(mint_quotas[msg.sender] >= amount, "Exceed the limit");
        unchecked {
            mint_quotas[msg.sender] -= amount;
        }
        minted += amount;

        RT.mint(to, amount);
        
        emit DelegateMint(msg.sender, to, amount);
    }

    function increaseQuota(address to, uint256 amount) external onlyRole(MANAGE_ROLE) {
        mint_quotas[to] += amount;
        emit QuotaIncreased(to, amount, mint_quotas[to]);
    }

    function setQuota(address to, uint256 amount) external onlyRole(MANAGE_ROLE) {
        mint_quotas[to] = amount;
        emit QuotaSeted(to, amount);
    }

    function _getMinEarnPrice(IRunbitShoes.MetaData memory meta, uint256 adjust1, 
                              uint256 adjust2, uint256 adjust3, uint256 price1) 
                              private pure returns (uint256) {
        uint256 maxEarn = uint256(meta.specialty + meta.comfort + meta.aesthetic 
                                  + adjust1 + adjust2 + adjust3) * meta.durability;
        return  price1 / maxEarn;
    }

    function addShoesCollection(IRunbitCollection.ShoesCollection memory collection) external onlyRole(OPERATE_ROLE) {
        require(!closeMint, "mint is closed!");
        uint256 minEarnPrice = _getMinEarnPrice(collection.meta, collection.adjust1, collection.adjust2, 
                                                collection.adjust3, collection.price1);
        require(minEarnPrice >= minPrice, "price too small!");
        require(collection.meta.durability >= minDuration, "duration too small!");
        RC.addShoesCollection(collection);
        emit DelegateAddCollection(msg.sender, collection);
    }

    function editShoesCollection(uint256 collectionId, uint256 price0, uint256 price1, uint256 status) external onlyRole(OPERATE_ROLE) {
        (IRunbitShoes.MetaData memory meta, uint256[10] memory data, ) = RC.shoesCollections(collectionId);
        uint256 minEarnPrice = _getMinEarnPrice(meta, data[6], data[7], data[8], price1);
        require(minEarnPrice >= minPrice, "price too small!");
        RC.editShoesCollection(collectionId, price0, price1, status);
        emit DelegateEditCollection(msg.sender, collectionId, price0, price1, status);
    }

    function RBSetInitTick(int256 _tick) external onlyRole(MANAGE_ROLE) {
        RBFound.setInitTick(_tick);
    }

    function RTSetInitTick(int256 _tick) external onlyRole(MANAGE_ROLE) {
        RTFound.setInitTick(_tick);
    }

    function RBBurn0Mint1(uint256 idx) external onlyRole(MANAGE_ROLE) 
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) {
        return RBFound.burn0Mint1(idx);
    }

    function RTBurn0Mint1(uint256 idx) external onlyRole(MANAGE_ROLE)
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) {
        return RTFound.burn0Mint1(idx);
    }

    function RBBurn1Mint0(uint256 idx) external onlyRole(MANAGE_ROLE)
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) {
        return RBFound.burn1Mint0(idx);
    }

    function RTBurn1Mint0(uint256 idx) external onlyRole(MANAGE_ROLE)
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) {
        return RTFound.burn1Mint0(idx);
    }

    function RBBurnNFT(uint256 tokenId) external onlyRole(MANAGE_ROLE) {
        RBFound.burnNFT(tokenId);
    }

    function RTBurnNFT(uint256 tokenId) external onlyRole(MANAGE_ROLE) {
        RTFound.burnNFT(tokenId);
    }

    function RBBurnToken0(uint256 amount) external onlyRole(MANAGE_ROLE) {
        RBFound.burnToken0(amount);
    }

    function RTBurnToken0(uint256 amount) external onlyRole(MANAGE_ROLE) {
        RTFound.burnToken0(amount);
    }

    function RBBurnToken1(uint256 amount) external onlyRole(MANAGE_ROLE) {
        RBFound.burnToken1(amount);
    }

    function RTBurnToken1(uint256 amount) external onlyRole(MANAGE_ROLE) {
        RTFound.burnToken1(amount);
    }

    function grantRole(bytes32 role, address account) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        if (!hasRole(role, account)) {
            role_accounts[role][role_count[role]] = account;
            role_count[role] += 1;
        }
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) public virtual override onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasRole(role, account)) {
            uint256 i = 0;
            for (; i < role_count[role]; ++i) {
                if (account == role_accounts[role][i]) {
                    break;
                }
            }
            if (i != role_count[role]) {
                role_count[role] -= 1;
                role_accounts[role][i] = role_accounts[role][role_count[role]];
            }
        }
        _revokeRole(role, account);
    }

    function _day() private view returns (uint256) {
        return (block.timestamp + 28800) / 86400;
    }

    event DelegateMint(address indexed op, address indexed to, uint256 amount);
    event QuotaIncreased(address indexed to, uint256 amount, uint256 quota);
    event QuotaSeted(address indexed to, uint256 quota);
    event DelegateAddCollection(address indexed op, IRunbitCollection.ShoesCollection colection);
    event DelegateEditCollection(address indexed op, uint256 indexed collectionId, uint256 price0, uint256 price1, uint256 status);
}