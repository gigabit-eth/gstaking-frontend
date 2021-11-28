import Web3 from "web3";
import { provider } from 'web3-core'
import ERC721FARMABI from "./abi/GausFarm.json";
import {AbiItem} from "web3-utils";

export const getErc721Contract = (prov: provider, address: string) => {
  const web3 = new Web3(prov)
  const contract = new web3.eth.Contract(
    (ERC721FARMABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}
