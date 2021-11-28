import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'

import { stake, getMasterChefContract } from '../sushi/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const sushi = useSushi()

  const handleStake = useCallback(
    async (amount: string) => {
      console.log('calling stake: ', pid, amount);
      const txHash = await stake(
        getMasterChefContract(sushi),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, sushi],
  )

  return { onStake: handleStake }
}

export default useStake
