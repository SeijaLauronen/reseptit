import React, { useEffect } from 'react';
import { OkButton, CloseButtonComponent } from './Button';
import { ScrollableFormContainer, ButtonGroup, GroupRight, SlideInContainerRight } from './Container';

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
      <ScrollableFormContainer>      
        {children}        
      </ScrollableFormContainer>
      <ButtonGroup>
          <GroupRight>
            <OkButton onClick={onCancel}></OkButton>                    
          </GroupRight>
      </ButtonGroup>
    </SlideInContainerRight>
  );
};

export default Info;
