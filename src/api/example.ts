
export type ExampleProps = {
  id: number,
  contract_name: string,
  file_url: string,
  description: string,
  size: number,
  bugs: number,
  file_type: 1 | 2,  // 1: Source Code 2: ByteCode
  create: number,
  hash: string,
  file?: File,
  result_id?: string | null,

  owner_address?: string;
  function_signature?: string;
  version?: string
  source_type?: number
  send_funcs?: string;
  receive_funcs?: string;
  events?:string;
  send_stores?: string;
  check?: string,
  file_source_type?:string
}

const exampleData: ExampleProps[] = [
  {
    id: 1,
    contract_name: "Meter.sol",
    file_url: '/example/Meter.sol',
    send_funcs:"deposit(uint8,bytes32,bytes);depositETH(uint8,bytes32,bytes)",
    receive_funcs:"executeProposal(uint8,uint64,bytes,bytes32)",
    events: "Deposit",
    send_stores:"balanceOf",
    description: "A test contract for T1",
    check:"T1",
    version:"0.6.4",
    size: 919,
    bugs: 2,
    file_type: 1,
    file_source_type:"Solidity source code",
    hash: '',
    create: new Date('2023-01-27 08:00').getTime()
  },
  {
    id: 2,
    contract_name: "CBridge_v2.sol",
    file_url: '/example/CBridge_v2.sol',
    send_funcs:"send(address,address,uint256,uint64,uint64,uint32);sendNative(address,uint256,uint64,uint64,uint32)",
    receive_funcs:"relay(bytes,bytes[],address[],uint256[])",
    events: "Send",
    send_stores:"Relay",
    description: "A test contract for T2",
    check:"T2",
    version:"0.8.9",
    size: 919,
    bugs: 1,
    file_type: 1,
    file_source_type:"Solidity source code",
    hash: '',
    create: new Date('2023-01-27 08:00').getTime()
  },
  {
    id: 3,
    contract_name: "Harmony.sol",
    file_url: '/example/Harmony.sol',
    send_funcs:"lockTokens(address,uint256,address);lockTokenFor(address,address,uint256,address)",
    receive_funcs:"unlockToken(address,uint256,address,bytes32)",
    events: "Locked",
    send_stores:"Unlocked",
    description: "A test contract for T3",
    check:"T3",
    version:"0.5.0",
    size: 919,
    bugs: 2,
    file_type: 1,
    file_source_type:"Solidity source code",
    hash: '',
    create: new Date('2023-01-27 08:00').getTime()
  },

]

export default exampleData