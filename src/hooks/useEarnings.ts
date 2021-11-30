import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract } from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {account} = useWallet()
  const sushi = useSushi()
  const masterChefContract = getMasterChefContract(sushi)
  const block = useBlock()

  const myPid = pid;
  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterChefContract, myPid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterChefContract, myPid])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, setBalance, sushi, fetchBalance])

  return balance
}

export default useEarnings
