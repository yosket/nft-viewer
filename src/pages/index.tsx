import type { NextPage } from 'next'
import { useEffect } from 'react'
import { NftContract } from '../lib/NftContract'

// const contractAddress = '0x0A83ac9a04072C6d931aab89481bDa342Fb75806'
const contractAddress = '0x617913Dd43dbDf4236B85Ec7BdF9aDFD7E35b340'

const HomePage: NextPage = () => {
  const handleConnect = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('has no wallet')
      }
      const [address]: string[] = await window.ethereum.request!({
        method: 'eth_requestAccounts',
      })
      const nftContract = new NftContract(contractAddress, window.ethereum)
      const hasNft = await nftContract.hasNft(address)
      if (!hasNft) {
        throw new Error('has no NFT')
      }
      const [tokenId] = await nftContract.getTokenIds(address)
      const tokenUri = await nftContract.getTokenUri(tokenId)
      const tokenInfo = await fetch(tokenUri).then((res) => res.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    handleConnect()
  }, [])

  return <div className=""></div>
}

export default HomePage
