import { ethers } from 'ethers'
import ERC721Enumerable from '../assets/ERC721Enumerable.abi.json'

export class NftContract {
  private _contract: ethers.Contract

  constructor(
    contractAddress: string,
    provider: ethers.providers.ExternalProvider
  ) {
    this._contract = new ethers.Contract(
      contractAddress,
      ERC721Enumerable,
      new ethers.providers.Web3Provider(provider)
    )
  }

  async totalSupply() {
    const totalSupply: ethers.BigNumber = await this._contract.totalSupply()
    return totalSupply.toNumber()
  }

  async tokenByIndex(index: number) {
    const tokenId: ethers.BigNumber = await this._contract.tokenByIndex(index)
    return tokenId.toNumber()
  }

  async tokenURI(tokenId: number) {
    const str: string = await this._contract.tokenURI(tokenId)
    return str
  }

  async hasNft(address: string) {
    const balance = await this._getBalance(address)
    return balance > 0
  }

  async getTokenIds(address: string) {
    const balance = await this._getBalance(address)
    return await Promise.all(
      Array.from(Array(balance).keys()).map((i) => this._getTokenId(address, i))
    )
  }

  async getTokenUri(tokenId: number) {
    return await this._contract.tokenURI(tokenId)
  }

  private async _getBalance(address: string) {
    const balance: ethers.BigNumber = await this._contract.balanceOf(address)
    return balance.toNumber()
  }

  private async _getTokenId(address: string, index: number) {
    const tokenId: ethers.BigNumber = await this._contract.tokenOfOwnerByIndex(
      address,
      index
    )
    return tokenId.toNumber()
  }
}
