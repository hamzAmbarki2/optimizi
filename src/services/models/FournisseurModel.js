import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Model fields (for reference/documentation)
export const FournisseurFields = {
  name: '',
  address: '',
  ownerId: '',
  image: '',
  matriculeFiscale: '',
  openingHours: '',
  useUserAddress: false,
  createdAt: '',
  updatedAt: '',
};

export const FournisseurModel = {
  async create(data) {
    return await addDoc(collection(db, 'Fournisseurs'), data);
  },
  async getById(id) {
    const docRef = doc(db, 'Fournisseurs', id);
    return await getDoc(docRef);
  },
  async getByOwner(ownerId) {
    const q = query(collection(db, 'Fournisseurs'), where('ownerId', '==', ownerId));
    return await getDocs(q);
  },
  async update(id, data) {
    const docRef = doc(db, 'Fournisseurs', id);
    return await updateDoc(docRef, data);
  },
  async delete(id) {
    const docRef = doc(db, 'Fournisseurs', id);
    return await deleteDoc(docRef);
  },
};
