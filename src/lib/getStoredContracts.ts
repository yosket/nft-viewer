import { initializeApp } from 'firebase/app'
import { collection, getDocs, getFirestore } from 'firebase/firestore'

export const getStoredContracts = async () => {
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string)
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const querySnapshot = await getDocs(collection(db, 'contracts'))
  const contracts: { chainId: number; address: string }[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data() as { chainId: number; address: string }
    contracts.push(data)
  })
  return contracts
}
