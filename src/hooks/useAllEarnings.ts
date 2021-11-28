import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../sushi/utils'
import useSushi from './useSushi'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  // const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    console.log('fetchAllBalances()');
    // const balances: Array<BigNumber> = await Promise.all(
    //   farms.map(({ pid }: { pid: number }) =>
    //     getEarned(masterChefContract, pid, account),
    //   ),
    // )
    // setBalance(balances)
  }, [account, masterChefContract, farms])

  useEffect(() => {
    console.log('useEffect: fetchBalances: ', account, masterChefContract, sushi, fetchAllBalances)
    if (account && masterChefContract && sushi) {
      fetchAllBalances()
    }
  }, [account, masterChefContract, sushi, fetchAllBalances])

  return balances
}

export default useAllEarnings
