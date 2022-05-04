import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useNftContract } from '../../hooks/useNftContract'

const AddressPage: NextPage = () => {
  const router = useRouter()
  const contractAddress = router.query.address as string
  const nftContract = useNftContract(contractAddress)

  const handleConnect = useCallback(async () => {
    try {
      if (!nftContract) {
        return
      }
      const totalSupply = await nftContract.totalSupply()
      const count = totalSupply > 10 ? 10 : totalSupply
      const tokenIds = await Promise.all(
        Array.from(Array(count).keys()).map((i) => nftContract.tokenByIndex(i))
      )
      const tokenUris = await Promise.all(
        tokenIds.map((id) => nftContract.tokenURI(id))
      )
      const res = await Promise.all(tokenUris.map((uri) => fetch(uri)))
      console.log(
        await Promise.all(res.map((r) => r.json())).catch(console.error)
      )
    } catch (e) {
      console.error(e)
    }
  }, [nftContract])

  useEffect(() => {
    handleConnect()
  }, [handleConnect])

  return <div className=""></div>
}

export default AddressPage
