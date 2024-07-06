import React, { useState } from 'react';
import EditForm from './EditForm';
import { InputName } from '../../components/Input';

const EditCategoryForm = ({ category, onSave, onCancel, onDelete, isOpen }) => {
  const [name, setName] = useState(category.name);

  const handleSave = () => {
    onSave(category.id, { name });
  };

  // Ei transientti props $isOpen, koska EditForm ei ole styled komponentti
  return (
    <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(category.id)}>
      <div>
        <label>Kategorian nimi</label>
        <InputName
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </EditForm>
  );
};

export default EditCategoryForm;
