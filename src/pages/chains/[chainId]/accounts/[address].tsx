import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnsName } from 'wagmi'
import AppPage from '../../../../components/AppPage'
import NftSummery from '../../../../components/NftSummery'
import { getMyMetadataList } from '../../../../lib/getMetadataList'
import { getProvider } from '../../../../lib/getProvider'
import { ERC721Enumerable__factory } from '../../../../types/ethers-contracts'

const contracts = [
  { chainId: 1, address: '0x273f7F8E6489682Df756151F5525576E322d51A3' },
  { chainId: 1, address: '0xdceaf1652a131F32a821468Dc03A92df0edd86Ea' },
]

type Props = {
  myMetadataList: any[]
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chainId = Number(params?.chainId)
  const address = params?.address as string

  const promises = contracts
    .filter((c) => c.chainId === chainId)
    .map((c) => {
      const provider = getProvider(c.chainId)
      const contract = ERC721Enumerable__factory.connect(c.address, provider)
      return Promise.all([
        contract.name(),
        getMyMetadataList(contract, address),
      ])
    })
  const res = await Promise.all(promises)
  const myMetadataList = res
    .flatMap(([name, list]) =>
      list.map((item: any) => ({ ...item, contractName: name }))
    )
    .sort((p, c) => {
      if (p.timestamp < c.timestamp) return -1
      if (p.timestamp > c.timestamp) return 1
      return 0
    })

  return { props: { myMetadataList } }
}

const AccountPage: NextPage<Props> = ({ myMetadataList }) => {
  const router = useRouter()
  const address = router.query.address as string
  const { data: ensName } = useEnsName({ address })

  if (router.isFallback) {
    return null
  }

  return (
    <AppPage className="space-y-4">
      <h1 className="text-xl md:text-3xl text-slate-500 font-bold text-center py-8 break-all">
        {ensName ?? address}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-8">
        {myMetadataList.map((m, i) => (
          <NftSummery key={i} metadata={m} contractName={m.contractName} />
        ))}
      </div>
    </AppPage>
  )
}

export default AccountPage
