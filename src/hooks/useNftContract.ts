import { useEffect, useState } from 'react'
import { NftContract } from '../lib/NftContract'

export const useNftContract = (contractAddress: string) => {
  const [nftContract, setNftContract] = useState<NftContract>()

  useEffect(() => {
    if (!contractAddress) {
      return
    }

    if (!window.ethereum) {
      throw new Error('has no wallet')
    }

    window.ethereum?.request!({
      method: 'eth_requestAccounts',
    }).then(() => {
      const nftContract = new NftContract(contractAddress, window.ethereum!)
      setNftContract(nftContract)
    })
  }, [contractAddress])

  return nftContract
}
