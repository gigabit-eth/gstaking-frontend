import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getMasterChefContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue, getPoolWeight,
} from '../sushi/utils'
import useSushi from './useSushi'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account } = useWallet()
  const sushi = useSushi()
  const farms = getFarms(sushi)
  const masterChefContract = getMasterChefContract(sushi)
  const wethContact = getWethContract(sushi)
  const block = useBlock()

  console.log('calling fetchAllStakedValue');
  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          (
            {
              tokenAmount: new BigNumber(0),
              wethAmount: new BigNumber(0),
              totalWethValue: new BigNumber(0),
              tokenPriceInWeth: new BigNumber(0),
              poolWeight: new BigNumber(0),
            }
          )
          // getTotalLPWethValue(
          //   masterChefContract,
          //   wethContact,
          //   lpContract,
          //   tokenContract,
          //   pid,
          // ),
      ),
    )

    setBalance(balances)
  }, [masterChefContract, farms, wethContact])

  useEffect(() => {
    if (account && masterChefContract && sushi) {
      fetchAllStakedValue()
    }
  }, [account, block, masterChefContract, setBalance, sushi, fetchAllStakedValue])

  return balances
}

export default useAllStakedValue
