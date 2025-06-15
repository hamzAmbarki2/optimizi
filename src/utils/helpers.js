// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Calculate percentage change
export const calculatePercentChange = (current, previous) => {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
};

// Get status color
export const getStatusColor = (status) => {
  const statusMap = {
    'Active': 'success',
    'Open': 'success',
    'Inactive': 'error',
    'Closed': 'error',
    'Out of Stock': 'error',
    'Delivered': 'success',
    'Shipped': 'info',
    'Processing': 'warning',
    'Pending': 'warning',
    'Cancelled': 'error'
  };
  
  return statusMap[status] || 'default';
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Search/filter function
export const filterItems = (items, searchTerm, filterField = 'name') => {
  if (!searchTerm) return items;
  
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return items.filter(item => {
    if (typeof item[filterField] === 'string') {
      return item[filterField].toLowerCase().includes(lowerCaseSearchTerm);
    }
    return false;
  });
};

// Sort items
export const sortItems = (items, sortField, sortDirection = 'asc') => {
  return [...items].sort((a, b) => {
    // Handle numeric values
    if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
      return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    }
    
    // Handle string values
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      return sortDirection === 'asc' 
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    
    // Default case
    return 0;
  });
};

// Generate random ID
export const generateId = (prefix = 'item') => {
  return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};