pragma solidity ^0.4.15;


contract generic_holder {

    address owner;

    address target = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;

    address buyer = 0xc435b7d915458ef540ade6068dfe2f44e8fa723e;

    modifier onlyowner {

        if (owner == msg.sender)

            _;

    }

    

    // constructor

    function generic_holder() {

        owner = msg.sender;

    }


    function changetarget(address sender) onlyowner{

        target = sender;

    } 

    

    function change_owner(address new_owner) {

        owner = new_owner;

    }

    

    function execute(uint _value, bytes _data) external onlyowner returns (bool){

        return target.call.value(_value)(_data);

    }


    function send(address _to, uint _value) external onlyowner returns (bool){

        return _to.send(_value); 

    }

    

    function get_owner() constant returns (address) {

        return owner;

    }

    

}