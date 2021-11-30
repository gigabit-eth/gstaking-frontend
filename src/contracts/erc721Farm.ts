import Web3 from "web3";
import { provider } from 'web3-core'
import ERC721FARMABI from "./abi/GausFarm.json";
import {AbiItem} from "web3-utils";
import BigNumber from "bignumber.js";
import {Contract} from "web3-eth-contract";

export const getErc721Contract = (prov: provider, address: string) => {
  const web3 = new Web3(prov)
  const contract = new web3.eth.Contract(
    (ERC721FARMABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}



export const stakeErc721 = async (erc721FarmContract: Contract, tokenId: number, account: string) => {
  return erc721FarmContract.methods.deposit([tokenId])
  .send({from: account, gas: new BigNumber(284840)})
  .on('transactionHash', (tx: any) => {
    console.log(tx);
    return tx.transactionHash;
  })
  .on('error', (err: any) => {
    console.error('Tx error: ', err);
  })
}



export const approveErc721Farm = async (erc721TokenContract: Contract, spenderAddress: string, account: string, tokenId: number) => {
  return erc721TokenContract.methods
  .approve(spenderAddress, tokenId)
  .send({ from: account })
  .on('transactionHash', (tx: any) => {
    console.log(tx);
    return tx.transactionHash;
  })
  .on('error', (err: any) => {
    console.error('Tx error: ', err);
  })
}
