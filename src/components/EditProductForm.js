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

const Input = styled.input`
  display: block;
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
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
    onSave(product.id, { name, categoryId });
  };

  return (
    <FormContainer>
      <h2>Edit Product</h2>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
      />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div>
        <Button onClick={handleSave}>Save</Button>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onDelete(product.id)}>Delete</Button>
      </div>
    </FormContainer>
  );
};

export default EditProductForm;
