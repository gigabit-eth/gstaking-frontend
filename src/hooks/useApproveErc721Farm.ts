import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import {approveErc721Farm} from "../contracts/erc721Farm";

const useApproveErc721Farm = (erc721TokenContract: Contract, erc721FarmContract: Contract) => {
  const { account } = useWallet()

  const onApprove = useCallback(async (tokenId: number) => {
    try {
      const tx = await approveErc721Farm(erc721TokenContract, erc721FarmContract.options.address, account, tokenId)
      return tx
    } catch (e) {
      return false
    }
  }, [account, erc721TokenContract, erc721FarmContract])

  return { onApproveErc721Farm: onApprove }
}

export default useApproveErc721Farm
