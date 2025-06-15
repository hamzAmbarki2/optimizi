import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export const productFields = {
  name: '',
  price: 0,
  categoryId: '',
  restaurantId: '',
  image: '',
  description: '',
  createdAt: '',
  updatedAt: '',
};

export const ProductModel = {
  async create(data) {
    return await addDoc(collection(db, 'products'), data);
  },
  async getById(id) {
    const docRef = doc(db, 'products', id);
    return await getDoc(docRef);
  },
  async getByRestaurant(restaurantId) {
    const q = query(collection(db, 'products'), where('restaurantId', '==', restaurantId));
    return await getDocs(q);
  },
  async update(id, data) {
    const docRef = doc(db, 'products', id);
    return await updateDoc(docRef, data);
  },
  async delete(id) {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
  },
};
