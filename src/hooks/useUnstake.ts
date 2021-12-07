import { useCallback } from 'react'

import { useWallet } from 'use-wallet'

import {Contract} from "web3-eth-contract";
import {unstakeErc721} from "../contracts/erc721Farm";

const useUnstake = (erc721FarmContract: Contract) => {
  const { account } = useWallet()

  const handleUnstake = useCallback(
    async (tokenId: number) => {
      const txHash = await unstakeErc721(erc721FarmContract, tokenId, account)
      console.log(txHash)
    },
    [account, erc721FarmContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
