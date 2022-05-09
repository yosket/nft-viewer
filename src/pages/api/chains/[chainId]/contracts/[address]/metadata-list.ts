import type { NextApiRequest, NextApiResponse } from 'next'
import { getMetadataList } from '../../../../../../lib/getMetadataList'
import { getProvider } from '../../../../../../lib/getProvider'
import { ERC721Enumerable__factory } from '../../../../../../types/ethers-contracts'

type Data = {
  name: string
  metadataList: any[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const chainId = Number(req.query.chainId)
  const contractAddress = req.query.address as string
  const provider = getProvider(chainId)

  const contract = ERC721Enumerable__factory.connect(contractAddress, provider)

  const [name, metadataList] = await Promise.all([
    contract.name(),
    getMetadataList(contract),
  ])

  res.status(200).json({ name, metadataList })
}

export default handler
