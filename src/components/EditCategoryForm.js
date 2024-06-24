import React, { useState } from 'react';
import styled from 'styled-components';

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

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SaveButton = styled(Button)`
  background-color: #4caf50;
  color: white;
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;
  margin-left: auto;
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
        <SaveButton onClick={handleSave}>Save</SaveButton>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      </ButtonGroup>
    </FormContainer>
  );
};

export default EditCategoryForm;
