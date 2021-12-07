import { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useBlock from './useBlock'
import {getDepositsOf} from "../contracts/erc721Farm";
import {Contract} from "web3-eth-contract";

const useStakedQuantity = (erc721FarmContract: Contract) => {
  const [quantity, setQuantity] = useState(0)
  const { account }: { account: string } = useWallet()
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const stakedTokenIds = await getDepositsOf(erc721FarmContract, account)
    setQuantity(stakedTokenIds.length)
  }, [account, erc721FarmContract])

  useEffect(() => {
    if (account) {
      fetchBalance()
    }
  }, [account, setQuantity, block, fetchBalance])

  return quantity
}

export default useStakedQuantity
