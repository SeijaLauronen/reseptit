import React, { useEffect } from 'react';
import styled from 'styled-components';
import { OkButton, CancelButton, DeleteButton, CloseButtonComponent } from './Button';

const SlideInContainer = styled.div`
  position: fixed;
  top: 50px;
  right: 0;
  width: 90%;
  max-width: 400px;
  height: auto;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});  
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
`;

const FormContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  margin: 20px 0;
`;

//TODO nämä button komponentiiin? toistoa shoppinglistalla
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Button group styles
const ButtonGroupLeft = styled.div`
  display: flex;
`;

const ButtonGroupRight = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex: 1;
  min-width: 0; /* Allow flex items to shrink to fit */
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
      <CloseButtonComponent onClick={onCancel}>Muokkaa</CloseButtonComponent>
      <FormContainer>      
        {children}
        <ButtonGroup>
          <ButtonGroupLeft>
            <DeleteButton onClick={onDelete} />
          </ButtonGroupLeft>
          <ButtonGroupRight>
            <OkButton onClick={onSave} />                    
          </ButtonGroupRight>
        </ButtonGroup>
      </FormContainer>
    </SlideInContainer>
  );
};

export default EditForm;
