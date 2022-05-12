import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'

export type Contract = { chainId: number; address: string }

export class StoredContractManager {
  private _db: Firestore

  constructor() {
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string)
    const app = initializeApp(firebaseConfig)
    this._db = getFirestore(app)
  }

  async getAll() {
    const querySnapshot = await getDocs(collection(this._db, 'contracts'))
    const contracts: Contract[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Contract
      contracts.push(data)
    })
    return contracts
  }

  async has({ address, chainId }: Contract) {
    const contractsRef = collection(this._db, 'contracts')
    const q = query(
      contractsRef,
      where('address', '==', address),
      where('chainId', '==', chainId)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.size > 0
  }

  async add(contract: Contract) {
    try {
      const addingContract = {
        ...contract,
        address: contract.address.toLowerCase(),
      }
      if (await this.has(addingContract)) {
        return
      }
      const docRef = await addDoc(
        collection(this._db, 'contracts'),
        addingContract
      )
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }
}
