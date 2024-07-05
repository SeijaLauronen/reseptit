import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { getDB } from '../database';
import { InputName, Select } from './Input';

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
        <InputName            
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nimi"
        />  
      </div>
      <div>
        <label>Kategoria </label>
           <Select
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
          >
            <option value=''>Ei kategoriaa</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </Select>
      </div>
    </EditForm>
  );
};

export default EditProductForm;
