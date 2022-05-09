import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import AppPage from '../../../../components/AppPage'
import NftSummery from '../../../../components/NftSummery'
import { getMetadataList } from '../../../../lib/getMetadataList'
import { getProvider } from '../../../../lib/getProvider'
import { ERC721Enumerable__factory } from '../../../../types/ethers-contracts'

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

const ContractPage: NextPage<Props> = ({ name, metadataList }) => {
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
          <NftSummery key={i} metadata={m} />
        ))}
      </div>
    </AppPage>
  )
}

export default ContractPage
