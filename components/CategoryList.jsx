import React from 'react';

function CategoryList({ categories }) {
  if (!categories || categories.length === 0) {
    return <img src="assets/public/null.png" alt="No categories" />;
  }

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
}

export default CategoryList;