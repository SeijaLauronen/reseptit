import React, { useEffect } from 'react';
import { OkButton, DeleteButton, CloseButtonComponent } from '../../components/Button';
import { FormContainer, ButtonGroup, GroupLeft, GroupRight, SlideInContainerRight as SlideInContainer } from '../../components/Container';

// TODO: Tässä ei jostain syystä liukuminen toteudu, vaikka Info-komponentissa samanlainen toteutuu

const EditForm = ({ isOpen, onSave, onCancel, onDelete, children, deleteEnabled = true }) => {
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
      
        {children}
        <ButtonGroup>
          <GroupLeft>
            {deleteEnabled &&
              <DeleteButton onClick={onDelete} />
            }
          </GroupLeft>
          <GroupRight>
            <OkButton onClick={onSave} />
          </GroupRight>
        </ButtonGroup>
     
    </SlideInContainer>
  );
};

export default EditForm;
