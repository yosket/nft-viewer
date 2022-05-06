import { useEffect, useState } from 'react'
import { useSigner } from 'wagmi'
import { NftContract } from '../lib/NftContract'

export const useNftContract = (contractAddress: string) => {
  const { data: signer } = useSigner()
  const [nftContract, setNftContract] = useState<NftContract>()
  const [name, setName] = useState<string>()

  useEffect(() => {
    if (!contractAddress || !signer) {
      return
    }

    const contract = new NftContract(contractAddress, signer)
    setNftContract(contract)

    contract.name().then(setName)
  }, [contractAddress, signer])

  return { nftContract, name }
}
