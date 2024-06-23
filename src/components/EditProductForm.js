import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';

const FormContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  margin: 20px 0;
`;

const EditProductForm = ({ product, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId || '');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const db = await getDB();
      const tx = db.transaction('categories', 'readonly');
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();
      setCategories(allCategories);
    };

    fetchCategories();
  }, []);

  const handleSave = () => {
    onSave(product.id, { name, categoryId: parseInt(categoryId, 10) });
  };

  return (
    <FormContainer>
      <h2>Edit Product</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
        >
          <option value=''>Uncategorized</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={() => onDelete(product.id)}>Delete</button>
    </FormContainer>
  );
};

export default EditProductForm;
