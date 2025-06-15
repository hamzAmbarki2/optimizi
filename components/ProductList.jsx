import React from 'react';
import nullImage from '../assets/null-image.png'; // Adjust path as needed

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <img src="assets/public/null.png" alt="No products" />;
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;