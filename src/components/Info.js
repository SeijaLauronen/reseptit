import React, { useEffect } from 'react';
import { OkButton, CloseButtonComponent } from './Button';
import { FormContainer, ButtonGroup, GroupRight, SlideInContainerRight } from './Container';

const Info = ({ isOpen, onCancel, children }) => {
  
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
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={onCancel}></CloseButtonComponent>
      <FormContainer>      
        {children}
        <ButtonGroup>
          <GroupRight>
            <OkButton onClick={onCancel}></OkButton>                    
          </GroupRight>
        </ButtonGroup>
      </FormContainer>
    </SlideInContainerRight>
  );
};

export default Info;
