import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// Correction des champs utilisateur pour correspondre au formulaire/dialog
export const userFields = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  cin: '',
  imageUrl: '',
  status: 'Active',
  createdAt: '',
  updatedAt: '',
};

export const UserModel = {
  async create(data) {
    return await addDoc(collection(db, 'users'), data);
  },
  async getById(id) {
    const docRef = doc(db, 'users', id);
    return await getDoc(docRef);
  },
  async getByEmail(email) {
    const q = query(collection(db, 'users'), where('email', '==', email));
    return await getDocs(q);
  },
  async update(id, data) {
    const docRef = doc(db, 'users', id);
    return await updateDoc(docRef, data);
  },
  async delete(id) {
    const docRef = doc(db, 'users', id);
    return await deleteDoc(docRef);
  },
};
