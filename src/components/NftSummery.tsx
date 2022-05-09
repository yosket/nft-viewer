import Image from 'next/image'
import { ComponentProps, FC } from 'react'

type Props = {
  metadata: any
  contractName?: string
} & ComponentProps<'div'>

const NftSummery: FC<Props> = ({ metadata, contractName, ...rest }) => {
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
      <div className="p-4 grid">
        {contractName && (
          <span className="text-slate-400 text-xs font-bold truncate">
            {contractName}
          </span>
        )}
        <span className="text-slate-700">{metadata.name}</span>
      </div>
    </div>
  )
}

export default NftSummery
