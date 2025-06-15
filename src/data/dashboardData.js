const dashboardData = {
  // Summary metrics
  metrics: {
    revenue: { value: 83500, change: 12.5 },
    orders: { value: 542, change: 8.3 },
    products: { value: 128, change: 4.7 },
    customers: { value: 1862, change: 15.2 },
  },
  
  // Sales data (for charts)
  salesData: [
    { month: 'Jan', sales: 8500 },
    { month: 'Feb', sales: 9200 },
    { month: 'Mar', sales: 8700 },
    { month: 'Apr', sales: 9800 },
    { month: 'May', sales: 10500 },
    { month: 'Jun', sales: 11200 },
    { month: 'Jul', sales: 10800 },
    { month: 'Aug', sales: 11500 },
    { month: 'Sep', sales: 12300 },
    { month: 'Oct', sales: 13100 },
    { month: 'Nov', sales: 14200 },
    { month: 'Dec', sales: 15500 },
  ],
  
  // Category distribution
  categoryDistribution: [
    { category: 'Electronics', percentage: 38 },
    { category: 'Clothing', percentage: 25 },
    { category: 'Home & Kitchen', percentage: 18 },
    { category: 'Books', percentage: 12 },
    { category: 'Others', percentage: 7 },
  ],
  
  // Recent orders
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', date: '2023-11-10', amount: 125.99, status: 'Delivered' },
    { id: 'ORD-002', customer: 'Sarah Johnson', date: '2023-11-09', amount: 89.50, status: 'Shipped' },
    { id: 'ORD-003', customer: 'Michael Brown', date: '2023-11-09', amount: 259.99, status: 'Processing' },
    { id: 'ORD-004', customer: 'Emily Wilson', date: '2023-11-08', amount: 76.25, status: 'Delivered' },
    { id: 'ORD-005', customer: 'David Martinez', date: '2023-11-08', amount: 199.99, status: 'Shipped' },
    { id: 'ORD-006', customer: 'Jennifer Garcia', date: '2023-11-07', amount: 45.50, status: 'Delivered' },
    { id: 'ORD-007', customer: 'Robert Taylor', date: '2023-11-07', amount: 320.75, status: 'Processing' },
    { id: 'ORD-008', customer: 'Lisa Anderson', date: '2023-11-06', amount: 149.99, status: 'Delivered' },
  ],
  
  // Top selling products
  topSellingProducts: [
    { id: 'PROD-001', name: 'Wireless Earbuds', category: 'Electronics', sold: 89, revenue: 4450 },
    { id: 'PROD-002', name: 'Smart Watch', category: 'Electronics', sold: 75, revenue: 9375 },
    { id: 'PROD-003', name: 'Winter Jacket', category: 'Clothing', sold: 68, revenue: 5440 },
    { id: 'PROD-004', name: 'Coffee Maker', category: 'Home & Kitchen', sold: 62, revenue: 4340 },
    { id: 'PROD-005', name: 'Fitness Tracker', category: 'Electronics', sold: 58, revenue: 2900 },
    { id: 'PROD-006', name: 'Laptop Stand', category: 'Electronics', sold: 52, revenue: 1300 },
  ],
};

export default dashboardData;