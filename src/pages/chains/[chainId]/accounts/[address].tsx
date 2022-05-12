import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEnsName } from 'wagmi'
import AppPage from '../../../../components/AppPage'
import NftSummery from '../../../../components/NftSummery'
import { getMyMetadataList } from '../../../../lib/getMetadataList'
import { getProvider } from '../../../../lib/getProvider'
import { StoredContractManager } from '../../../../lib/StoredContractManager'
import { ERC721Enumerable__factory } from '../../../../types/ethers-contracts'

type Props = {
  myMetadataList: any[]
}

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: true }
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const chainId = Number(params?.chainId)
  const address = params?.address as string

  const constractManager = new StoredContractManager()
  const contracts = await constractManager.getAll()

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
