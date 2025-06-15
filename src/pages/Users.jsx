import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import UserCard from '../components/users/UserCard';
import UserDialog from '../components/users/UserDialog';

const Users = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const q = query(collection(db, 'users'), where('restaurantOwner', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        setUsers(users.filter(user => user.id !== userId));
        setSuccess('User deleted successfully.');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const dataWithTimestamps = {
        ...userData,
        restaurantOwner: currentUser.uid,
        updatedAt: new Date().toISOString(),
        ...(selectedUser ? {} : { createdAt: new Date().toISOString() }),
      };
      if (selectedUser) {
        await updateDoc(doc(db, 'users', selectedUser.id), dataWithTimestamps);
        setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...dataWithTimestamps } : user));
        setSuccess('User updated successfully.');
      } else {
        const docRef = await addDoc(collection(db, 'users'), dataWithTimestamps);
        setUsers([...users, { id: docRef.id, ...dataWithTimestamps }]);
        setSuccess('User created successfully.');
      }
      setTimeout(() => setSuccess(''), 3000);
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to save user.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Users Management
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddUser}>
          Add User
        </Button>
      </Box>
      {error && <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light' }}><Typography color="error">{error}</Typography></Paper>}
      {success && <Paper sx={{ p: 2, mb: 2, bgcolor: 'success.light' }}><Typography color="success.main">{success}</Typography></Paper>}
      <Grid container spacing={3}>
        {users.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography>No users found. Add your first user!</Typography>
            </Paper>
          </Grid>
        ) : (
          users.map(user => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <UserCard user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />
            </Grid>
          ))
        )}
      </Grid>
      <UserDialog open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleSaveUser} user={selectedUser} />
    </Box>
  );
};

export default Users;