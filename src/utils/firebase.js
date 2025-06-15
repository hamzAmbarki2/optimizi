import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// User CRUD operations
export const userService = {
  // Create a new user
  create: async (userData, restaurantOwnerId) => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        restaurantOwnerId,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...userData };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get all users for a restaurant owner
  getByRestaurantOwner: async (restaurantOwnerId) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('restaurantOwnerId', '==', restaurantOwnerId),
        where('role', '==', 'user'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update a user
  update: async (userId, userData) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...userData,
        updatedAt: new Date().toISOString(),
      });
      return { id: userId, ...userData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete a user
  delete: async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return userId;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Check user count for a restaurant owner
  getUserCount: async (restaurantOwnerId) => {
    try {
      const q = query(
        collection(db, 'users'),
        where('restaurantOwnerId', '==', restaurantOwnerId),
        where('role', '==', 'user')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting user count:', error);
      throw error;
    }
  },

  // Update user status (active, inactive, suspended)
  updateStatus: async (userId, status) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status,
        updatedAt: new Date().toISOString(),
      });
      return { userId, status };
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }
};

// General Firebase utilities
export const firebaseUtils = {
  // Format timestamp for display
  formatTimestamp: (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  },

  // Validate required fields
  validateUserData: (userData) => {
    const required = ['email', 'fullName', 'cin', 'phone'];
    const missing = required.filter(field => !userData[field] || !userData[field].trim());
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    return true;
  },

  // Handle Firebase errors
  handleFirebaseError: (error) => {
    console.error('Firebase error:', error);
    
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action';
      case 'not-found':
        return 'The requested data was not found';
      case 'already-exists':
        return 'This data already exists';
      case 'resource-exhausted':
        return 'Too many requests. Please try again later';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
};

export default { userService, firebaseUtils};