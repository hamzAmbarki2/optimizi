import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export const categoryFields = {
  name: '',
  restaurantId: '',
  description: '',
  createdAt: '',
  updatedAt: '',
};

export const CategoryModel = {
  async create(data) {
    return await addDoc(collection(db, 'categories'), data);
  },
  async getById(id) {
    const docRef = doc(db, 'categories', id);
    return await getDoc(docRef);
  },
  async getByRestaurant(restaurantId) {
    const q = query(collection(db, 'categories'), where('restaurantId', '==', restaurantId));
    return await getDocs(q);
  },
  async update(id, data) {
    const docRef = doc(db, 'categories', id);
    return await updateDoc(docRef, data);
  },
  async delete(id) {
    const docRef = doc(db, 'categories', id);
    return await deleteDoc(docRef);
  },
};
