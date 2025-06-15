import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Model fields (for reference/documentation)
export const restaurantFields = {
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

export const RestaurantModel = {
  async create(data) {
    return await addDoc(collection(db, 'restaurants'), data);
  },
  async getById(id) {
    const docRef = doc(db, 'restaurants', id);
    return await getDoc(docRef);
  },
  async getByOwner(ownerId) {
    const q = query(collection(db, 'restaurants'), where('ownerId', '==', ownerId));
    return await getDocs(q);
  },
  async update(id, data) {
    const docRef = doc(db, 'restaurants', id);
    return await updateDoc(docRef, data);
  },
  async delete(id) {
    const docRef = doc(db, 'restaurants', id);
    return await deleteDoc(docRef);
  },
};
