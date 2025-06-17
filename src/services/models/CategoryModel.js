import { db } from '../../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getCountFromServer 
} from 'firebase/firestore';

export const categoryFields = {
  name: '',
  FournisseurId: '',
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
  
  async getByFournisseur(FournisseurId) {
    const q = query(collection(db, 'categories'), where('FournisseurId', '==', FournisseurId));
    return await getDocs(q);
  },
  
  async searchByTitle(FournisseurId, searchTerm) {
    const q = query(
      collection(db, 'categories'),
      where('FournisseurId', '==', FournisseurId),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff')
    );
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
  
  async deleteByFournisseur(FournisseurId) {
    const q = query(collection(db, 'categories'), where('FournisseurId', '==', FournisseurId));
    const snapshot = await getDocs(q);
    const batchDeletes = [];
    snapshot.forEach((docSnap) => {
      batchDeletes.push(deleteDoc(doc(db, 'categories', docSnap.id)));
    });
    await Promise.all(batchDeletes);
    return true;
  },
  
  async getProductsCount(categoryId) {
    const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  },
};