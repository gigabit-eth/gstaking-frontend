import {Contract} from "web3-eth-contract";

export interface Farm {
  // pid: number
  name: string
  // lpToken: string
  erc721TokenName: string
  erc721TokenAddress: string
  erc721FarmAddress: string
  erc721FarmContract: Contract
  erc721TokenContract: Contract
  // tokenAddress: string
  earnTokenName: string
  earnTokenAddress: string
  icon: React.ReactNode
  id: string
  // tokenSymbol: string
}

export interface FarmsContext {
  farms: Farm[]
  unharvested: number
}
