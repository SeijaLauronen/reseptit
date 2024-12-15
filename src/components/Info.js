import React, { useEffect } from 'react';
import { OkButton, CloseButtonComponent } from './Button';
import { ScrollableFormContainer, ButtonGroup, GroupRight, SlideInContainerRight } from './Container';

const Info = ({ isOpen, onCancel, children }) => {
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; //sivun taustarullaus (scrolling) estetään
    } else {
      document.body.style.overflow = 'auto'; //sivun taustarullaus normaaliksi
    }
    return () => {
      document.body.style.overflow = 'auto'; //vierityksen esto poistuu aina, kun komponentti unmountataan (eli poistetaan DOM:sta)
    };
  }, [isOpen]);
  
  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (    
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={onCancel}></CloseButtonComponent>
      <ScrollableFormContainer>                 
        {React.isValidElement(children) ? children : <div>{children}</div>}
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
