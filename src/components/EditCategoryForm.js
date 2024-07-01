import React, { useState } from 'react';
import styled from 'styled-components';
import { SaveButton, CancelButton, DeleteButton } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FormContainer = styled.div`
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;


const EditCategoryForm = ({ category, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState(category.name);

  const handleSave = () => {
    onSave(category.id, { name });
  };

  const handleDelete = () => {
    onDelete(category.id);
  };

  return (
    <FormContainer>
      <FormGroup>
        <Label>Category Name</Label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormGroup>
      <ButtonGroup>
        <SaveButton onClick={handleSave}/>
        <CancelButton onClick={onCancel}/>
        <DeleteButton onClick={handleDelete}/>
      </ButtonGroup>
    </FormContainer>
  );
};

export default EditCategoryForm;
