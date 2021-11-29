import BigNumber from 'bignumber.js/bignumber'
import ERC20Abi from './abi/erc20.json'
import ERC721Abi from './abi/erc721.json'
import GausFarmAbi from '../../contracts/abi/GausFarm.json';
import MasterChefAbi from './abi/masterchef.json'
import SushiAbi from './abi/sushi.json'
import WETHAbi from './abi/weth.json'
import {
  contractAddresses,
  SUBTRACT_GAS_LIMIT, supportedFarms,
} from './constants.js'
import * as Types from './types.js'

export class Contracts {
  constructor(provider, networkId, web3, options) {
    this.web3 = web3
    this.defaultConfirmations = options.defaultConfirmations
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5
    this.confirmationType =
      options.confirmationType || Types.ConfirmationType.Confirmed
    this.defaultGas = options.defaultGas
    this.defaultGasPrice = options.defaultGasPrice

    this.sushi = new this.web3.eth.Contract(SushiAbi)
    this.masterChef = new this.web3.eth.Contract(MasterChefAbi)
    // this.xSushiStaking = new this.web3.eth.Contract(XSushiAbi)
    this.weth = new this.web3.eth.Contract(WETHAbi)

    console.log('setting farms', supportedFarms);
    // this.pools = supportedPools.map((pool) => {
    //   console.log('mapping pool: ', pool, 'networkId: ', networkId);
    //   return Object.assign(pool, {
    //     lpAddress: pool.lpAddresses[networkId],
    //     tokenAddress: pool.tokenAddresses[networkId],
    //     lpContract: new this.web3.eth.Contract(UNIV2PairAbi, pool.lpAddresses[networkId]),
    //     tokenContract: new this.web3.eth.Contract(ERC721Abi, pool.tokenAddresses[networkId]),
    //   })
    // })
    this.farms = supportedFarms.map((farm) => {
      console.log('mapping farm: ', farm, 'networkId: ', networkId);
      return Object.assign(farm, {
        erc721TokenAddress: farm.erc721TokenAddresses[networkId],
        erc721TokenName: farm.erc721TokenNames[networkId],
        erc721FarmAddress: farm.erc721FarmAddresses[networkId],
        earnTokenAddress: farm.earnTokenAddresses[networkId],
        earnTokenName: farm.earnTokenNames[networkId],
        erc721TokenContract: new this.web3.eth.Contract(ERC721Abi, farm.erc721TokenAddresses[networkId]),
        erc721FarmContract: new this.web3.eth.Contract(GausFarmAbi.abi, farm.erc721FarmAddresses[networkId]),
        earnTokenContract: new this.web3.eth.Contract(ERC20Abi, farm.earnTokenAddresses[networkId]),
      })
    })
    console.log('pools: ', this.pools);

    this.setProvider(provider, networkId)
    this.setDefaultAccount(this.web3.eth.defaultAccount)
  }

  setProvider(provider, networkId) {
    const setProvider = (contract, address) => {
      contract.setProvider(provider)
      if (address) contract.options.address = address
      else console.error('Contract address not found in network', networkId)
    }

    // console.log('set sushi provider');
    setProvider(this.sushi, contractAddresses.sushi[networkId])
    // console.log('set mc provider');
    setProvider(this.masterChef, contractAddresses.masterChef[networkId])
    // setProvider(this.xSushiStaking, contractAddresses.xSushi[networkId])
    // console.log('set weth provider');
    setProvider(this.weth, contractAddresses.weth[networkId])

    this.farms.forEach(
      ({ erc721TokenContract, erc721TokenAddress, erc721FarmContract, erc721FarmAddress, earnTokenContract, earnTokenAddress }) => {
        setProvider(erc721TokenContract, erc721TokenAddress)
        setProvider(erc721FarmContract, erc721FarmAddress)
        setProvider(earnTokenContract, earnTokenAddress)
      },
    )
  }

  setDefaultAccount(account) {
    this.sushi.options.from = account
    this.masterChef.options.from = account
  }

  async callContractFunction(method, options) {
    const {
      confirmations,
      confirmationType,
      autoGasMultiplier,
      ...txOptions
    } = options

    if (!this.blockGasLimit) {
      await this.setGasLimit()
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate
      if (
        this.defaultGas &&
        confirmationType !== Types.ConfirmationType.Simulate
      ) {
        txOptions.gas = this.defaultGas
      } else {
        try {
          console.log('estimating gas')
          gasEstimate = await method.estimateGas(txOptions)
        } catch (error) {
          const data = method.encodeABI()
          const { from, value } = options
          const to = method._parent._address
          error.transactionData = { from, value, data, to }
          throw error
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier
        const totalGas = Math.floor(gasEstimate * multiplier)
        txOptions.gas =
          totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas
        return { gasEstimate, g }
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0)
    } else {
      txOptions.value = '0'
    }

    const promi = method.send(txOptions)

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    }

    let hashOutcome = OUTCOMES.INITIAL
    let confirmationOutcome = OUTCOMES.INITIAL

    const t =
      confirmationType !== undefined ? confirmationType : this.confirmationType

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`)
    }

    let hashPromise
    let confirmationPromise

    if (
      t === Types.ConfirmationType.Hash ||
      t === Types.ConfirmationType.Both
    ) {
      hashPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        promi.on('transactionHash', (txHash) => {
          if (hashOutcome === OUTCOMES.INITIAL) {
            hashOutcome = OUTCOMES.RESOLVED
            resolve(txHash)
            if (t !== Types.ConfirmationType.Both) {
              const anyPromi = promi
              anyPromi.off()
            }
          }
        })
      })
    }

    if (
      t === Types.ConfirmationType.Confirmed ||
      t === Types.ConfirmationType.Both
    ) {
      confirmationPromise = new Promise((resolve, reject) => {
        promi.on('error', (error) => {
          if (
            (t === Types.ConfirmationType.Confirmed ||
              hashOutcome === OUTCOMES.RESOLVED) &&
            confirmationOutcome === OUTCOMES.INITIAL
          ) {
            confirmationOutcome = OUTCOMES.REJECTED
            reject(error)
            const anyPromi = promi
            anyPromi.off()
          }
        })

        const desiredConf = confirmations || this.defaultConfirmations
        if (desiredConf) {
          promi.on('confirmation', (confNumber, receipt) => {
            if (confNumber >= desiredConf) {
              if (confirmationOutcome === OUTCOMES.INITIAL) {
                confirmationOutcome = OUTCOMES.RESOLVED
                resolve(receipt)
                const anyPromi = promi
                anyPromi.off()
              }
            }
          })
        } else {
          promi.on('receipt', (receipt) => {
            confirmationOutcome = OUTCOMES.RESOLVED
            resolve(receipt)
            const anyPromi = promi
            anyPromi.off()
          })
        }
      })
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash }
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise
    }

    const transactionHash = await hashPromise
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    }
  }

  async callConstantContractFunction(method, options) {
    const m2 = method
    const { blockNumber, ...txOptions } = options
    return m2.call(txOptions, blockNumber)
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest')
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT
  }
}
