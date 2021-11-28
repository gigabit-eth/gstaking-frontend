import { useCallback } from 'react'

import { useWallet } from 'use-wallet'

import {stakeErc721} from '../sushi/utils'
import {Contract} from "web3-eth-contract";

const useStakeErc721 = (erc721FarmContract: Contract) => {
  const { account } = useWallet()

  const handleStakeErc721 = useCallback(
    async (tokenId: number) => {
      console.log('calling useStakeErc721: ', erc721FarmContract, tokenId);
      const txHash = await stakeErc721(
        erc721FarmContract,
        tokenId,
        account,
      )
      console.log(txHash)
    },
    [account, erc721FarmContract],
  )

  return { onStakeErc721: handleStakeErc721 }
}

export default useStakeErc721
