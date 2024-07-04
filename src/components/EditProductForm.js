import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { getDB } from '../database';

const EditProductForm = ({ product, onSave, onCancel, onDelete, isOpen }) => {
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
    <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(product.id)}>
      <div>
        <label>Nimi </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Kategoria </label>
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
    </EditForm>
  );
};

export default EditProductForm;
