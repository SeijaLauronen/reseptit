import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { InputName, Select } from '../../components/Input';
import Toast from '../../components/Toast';
import { getCategories } from '../../controller';

const EditProductForm = ({ product, onSave, onCancel, onDelete, isOpen }) => {
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId || '');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const fetchAndSetCategories = async () => {
    try {
      const allCategories = await getCategories(false); // aakkosjärjestyksessä
      setCategories(allCategories);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, []);


  const handleSave = () => {
    onSave(product.id, { name, categoryId: parseInt(categoryId, 10) });
  };

  // transientti props $isOpen ei käytetä, koska EditForm ei ole styled komponentti
  return (
    <>
    { error && (
        <Toast message={error} onClose={() => setError('')} />
    )}

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
    </>
  );
};

export default EditProductForm;
