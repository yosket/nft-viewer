import { fetchJson } from 'ethers/lib/utils'
import { ERC721Enumerable } from '../types/ethers-contracts'

const LIMIT = 18

const fetchMetadata = async (uri: string) => {
  if (uri.startsWith('ipfs://')) {
    return fetchJson(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
  }
  if (uri.startsWith('data:')) {
    return fetchJson(uri)
  }
  return fetch(uri).then((r) => r.json())
}

export const getMetadataList = async (contract: ERC721Enumerable) => {
  const totalSupply = (await contract.totalSupply()).toNumber()
  const count = totalSupply > LIMIT ? LIMIT : totalSupply
  const tokenIds = await Promise.all(
    Array.from(Array(count).keys()).map((i) => contract.tokenByIndex(i))
  )
  const tokenUris = await Promise.all(
    tokenIds.map((id) => contract.tokenURI(id))
  )
  return await Promise.all(tokenUris.map((uri) => fetchMetadata(uri)))
}

export const getMyMetadataList = async (
  contract: ERC721Enumerable,
  address: string
) => {
  const balance = (await contract.balanceOf(address)).toNumber()
  const tokenIds = await Promise.all(
    Array.from(Array(balance).keys()).map((i) =>
      contract.tokenOfOwnerByIndex(address, i)
    )
  )
  const tokenUris = await Promise.all(
    tokenIds.map((id) => contract.tokenURI(id))
  )
  return await Promise.all(tokenUris.map((uri) => fetchMetadata(uri)))
}
