// Empty users data - all mock data removed
const usersData = {
  users: [], // Remove all mock users
  
  // Keep only the status options for the form
  statuses: [
    { id: 'active', name: 'active' },
    { id: 'inactive', name: 'inactive' },
    { id: 'suspended', name: 'suspended' }
  ]
};

export default usersData;