import React, { useEffect } from 'react';
import styled from 'styled-components';
import { OkButton, DeleteButton, CloseButtonComponent } from '../../components/Button';
import { FormContainer, ButtonGroup, GroupLeft, GroupRight } from '../../components/Container';

const SlideInContainer = styled.div`
  position: fixed;
  top: 200px;
  right: 0;
  width: 90%;
  max-width: 400px;
  height: auto;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});  
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;
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

  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (    
    <SlideInContainer $isOpen={isOpen}>
      <CloseButtonComponent onClick={onCancel}>Muokkaa</CloseButtonComponent>
      <FormContainer>      
        {children}
        <ButtonGroup>
          <GroupLeft>
            <DeleteButton onClick={onDelete} />
          </GroupLeft>
          <GroupRight>
            <OkButton onClick={onSave} />                    
          </GroupRight>
        </ButtonGroup>
      </FormContainer>
    </SlideInContainer>
  );
};

export default EditForm;
