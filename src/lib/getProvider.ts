import { ethers } from 'ethers'

export const getProvider = (chainId: number) => {
  switch (chainId) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 4:
    case 42:
    case 137:
    case 80001: {
      return new ethers.providers.InfuraProvider(
        chainId,
        process.env.INFURA_PROJECT_ID
      )
    }
    case 56: {
      return new ethers.providers.JsonRpcProvider(
        'https://bsc-dataseed1.binance.org'
      )
    }
    case 592: {
      return new ethers.providers.JsonRpcProvider(
        'https://rpc.astar.network:8545'
      )
    }
    case 248: {
      return new ethers.providers.JsonRpcProvider(
        'https://rpc.mainnet.oasys.games'
      )
    }
    case 20197: {
      return new ethers.providers.JsonRpcProvider(
        'https://rpc.sandverse.oasys.games'
      )
    }
    default: {
      return new ethers.providers.BaseProvider(chainId)
    }
  }
}
