import Link from 'next/link'
import { FC } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useUtil } from '../hooks/useUtil'

const WalletConnectButton: FC = () => {
  const { data } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  const { activeChain } = useNetwork()
  const { getCroppedAddress } = useUtil()

  if (data) {
    return (
      <div className="space-x-4 md:space-x-8">
        <span>{activeChain?.name}</span>
        <span>{data.address ? getCroppedAddress(data.address) : null}</span>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  }

  return <button onClick={() => connect()}>Connect Wallet</button>
}

const AppHeader: FC = () => {
  return (
    <div className="flex justify-between items-center p-4 md:px-8 bg-white text-slate-500">
      <Link href="/">
        <a className="font-bold text-lg">NFT Viewer</a>
      </Link>
      <WalletConnectButton />
    </div>
  )
}

export default AppHeader
