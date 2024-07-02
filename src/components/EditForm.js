import React, { useEffect } from 'react';
import styled from 'styled-components';
import { OkButton, CancelButton, DeleteButton } from './Button';

const SlideInContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  margin: 20px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const EditForm = ({ isOpen, onSave, onCancel, onDelete, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <SlideInContainer isOpen={isOpen}>
      <FormContainer>
        {children}
        <ButtonGroup>
          <OkButton onClick={onSave} />
          <CancelButton onClick={onCancel} />
          <DeleteButton onClick={onDelete} />
        </ButtonGroup>
      </FormContainer>
    </SlideInContainer>
  );
};

export default EditForm;
