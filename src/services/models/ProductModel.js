import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export const productFields = {
  name: '',
  prixHTVA: 0,
  tva: 19,
  prixTTC: 0,
  categoryId: '',
  FournisseurId: '',
  image: '',
  description: '',
  createdAt: '',
  updatedAt: '',
  review: [], // Array of review objects or strings, default empty
};

export const ProductModel = {
  async create(data) {
    // Ajoute review: [] si non fourni
    let isAvailable = data.isAvailable;
    if (typeof data.stockQuantity !== 'undefined' && Number(data.stockQuantity) === 0) {
      isAvailable = false;
    }
    const dataWithReview = { ...data, review: [], isAvailable };
    return await addDoc(collection(db, 'products'), dataWithReview);
  },
  async getById(id) {
    const docRef = doc(db, 'products', id);
    return await getDoc(docRef);
  },
  async getByFournisseur(FournisseurId) {
    const q = query(collection(db, 'products'), where('FournisseurId', '==', FournisseurId));
    return await getDocs(q);
  },
  async update(id, data) {
    // Empêche la modification du champ review par l'admin
    const { review, ...rest } = data;
    let isAvailable = rest.isAvailable;
    if (typeof rest.stockQuantity !== 'undefined' && Number(rest.stockQuantity) === 0) {
      isAvailable = false;
    }
    return await updateDoc(doc(db, 'products', id), { ...rest, isAvailable });
  },
  async delete(id) {
    const docRef = doc(db, 'products', id);
    return await deleteDoc(docRef);
  },
  async deleteByFournisseur(FournisseurId) {
    const q = query(collection(db, 'products'), where('FournisseurId', '==', FournisseurId));
    const snapshot = await getDocs(q);
    const batchDeletes = [];
    snapshot.forEach((docSnap) => {
      batchDeletes.push(deleteDoc(doc(db, 'products', docSnap.id)));
    });
    await Promise.all(batchDeletes);
    return true;
  },
  async deleteByCategory(categoryId) {
    const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    const batchDeletes = [];
    snapshot.forEach((docSnap) => {
      batchDeletes.push(deleteDoc(doc(db, 'products', docSnap.id)));
    });
    await Promise.all(batchDeletes);
    return true;
  },
};
