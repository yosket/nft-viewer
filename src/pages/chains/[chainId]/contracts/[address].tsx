import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ComponentProps, FC } from 'react'
import AppPage from '../../../../components/AppPage'
import { getMetadataList } from '../../../../lib/getMetadataList'
import { getProvider } from '../../../../lib/getProvider'
import { ERC721Enumerable__factory } from '../../../../types/ethers-contracts'

type ItemProps = {
  metadata: any
} & ComponentProps<'div'>

const Item: FC<ItemProps> = ({ metadata, ...rest }) => {
  const getImageSrc = (uri: string) => {
    if (uri.startsWith('http')) {
      return `/api/image-proxy?imageUrl=${uri}`
    }
    if (uri.startsWith('ipfs://')) {
      const imageUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      return `/api/image-proxy?imageUrl=${imageUrl}`
    }
    return uri
  }

  return (
    <div className="bg-white rounded-2xl" {...rest}>
      <div className="rounded-t-2xl overflow-hidden -mb-1">
        <Image
          src={getImageSrc(metadata.image)}
          alt={metadata.name}
          width={320}
          height={320}
        />
      </div>
      <div className="text-slate-500 p-4">{metadata.name}</div>
    </div>
  )
}

type Props = {
  name: string
  metadataList: any[]
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chainId = Number(params?.chainId)
  const contractAddress = params?.address as string
  const provider = getProvider(chainId)

  const contract = ERC721Enumerable__factory.connect(contractAddress, provider)

  const [name, metadataList] = await Promise.all([
    contract.name(),
    getMetadataList(contract),
  ])

  return { props: { name, metadataList } }
}

const AddressPage: NextPage<Props> = ({ name, metadataList }) => {
  const router = useRouter()

  if (router.isFallback) {
    return null
  }

  return (
    <AppPage className="space-y-4">
      <h1 className="text-3xl md:text-5xl text-slate-500 font-bold text-center py-8 break-all">
        {name}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8">
        {metadataList.map((m, i) => (
          <Item key={i} metadata={m} />
        ))}
      </div>
    </AppPage>
  )
}

export default AddressPage
