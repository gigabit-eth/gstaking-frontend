import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

// const GAS_LIMIT = {
//   STAKING: {
//     DEFAULT: 200000,
//     SNX: 850000,
//   },
// }

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}
export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const getXSushiStakingContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.xSushiStaking
}

export const getFarms = (sushi) => {
  return sushi ? sushi.contracts.farms : [];
  // return sushi
  //   ? sushi.contracts.farms.map(
  //       ({
  //         // pid,
  //         name,
  //         symbol,
  //         icon,
  //         tokenAddress,
  //         tokenSymbol,
  //         tokenContract,
  //         lpAddress,
  //         lpContract,
  //       }) => ({
  //         // pid,
  //         id: symbol,
  //         name,
  //         lpToken: symbol,
  //         erc721FarmAddress: lpAddress,
  //         lpContract,
  //         tokenAddress,
  //         tokenSymbol,
  //         tokenContract,
  //         earnToken: 'RNG',
  //         earnTokenAddress: sushi.contracts.sushi.options.address,
  //         icon,
  //       }),
  //     )
  //   : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  console.log('masterChefContract.methods.poolInfo(pid).call()');
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  console.log('masterChefContract.methods.pendingRng(pid, account).call()', pid, account);
  try {
    return await masterChefContract.methods.pendingRng(pid, account).call()
  } catch (err) {
    console.log('Error fetching earned', err);
    return 0;
  }

}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  console.log('getTotalLPWethValue mc:', masterChefContract, 'weth: ', wethContract, 'lp: ', lpContract, 'token: ', tokenContract, pid);
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  console.log('calling balanceOf');
  let balance = await lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  .catch(err => {
    console.log('error calling balanceOf: ', err);
    balance = 0;
  })
  // Convert that into the portion of total lpContract = p1
  console.log('await lpContract.methods.totalSupply().call()');
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(0))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const approveAddress = async (lpContract, address, account) => {
  return lpContract.methods
    .approve(address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  console.log('sushi.contracts.sushi.methods.totalSupply().call())');
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const getXSushiSupply = async (sushi) => {
  console.log('sushi.contracts.xSushiStaking.methods.totalSupply().call()')
  return new BigNumber(await sushi.contracts.xSushiStaking.methods.totalSupply().call())
}

export const stakeErc721 = async (erc721FarmContract, tokenId, account) => {
  return erc721FarmContract.methods.deposit([tokenId])
  .send({from: account, gas: new BigNumber(284840)})
  .on('transactionHash', tx => {
    console.log(tx);
    return tx.transactionHash;
  })
  .on('error', err => {
    console.error('Tx error: ', err);
  })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account, gas: new BigNumber(21000) })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    console.log('userInfo.call()');
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const enter = async (contract, amount, account) => {
  debugger
  return contract.methods
    .enter(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const leave = async (contract, amount, account) => {
  return contract.methods
    .leave(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
