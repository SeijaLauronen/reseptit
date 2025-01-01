import React, { useState } from 'react';
import EditForm from './EditForm';
import { InputName, InputTextArea } from '../../components/Input';

const EditDayForm = ({ day, onSave, onCancel, onDelete, isOpen }) => {
  const [name, setName] = useState(day.name);
  const [info, setInfo] = useState(day.info);

  const handleSave = () => {
    day.name = name;
    day.info = info;
    onSave(day.id, day);
  };

  // Ei transientti props $isOpen, koska EditForm ei ole styled komponentti
  return (
    <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(day.id)}>
      <h4>Päivän tiedot</h4>
      <div>
        <label>Nimi</label>
        <InputName
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Muistiinpanot: </label>
        <InputTextArea
          value={info}
          onChange={(e) => setInfo(e.target.value)} // Muutostilan päivitys
          placeholder="Muistiinpanot"
        />
      </div>
    </EditForm>
  );
};

export default EditDayForm;
