import React from 'react';
import styled from 'styled-components';
import { ConfirmDangerButton, CancelButton, SaveButton, UndoButton } from './Button'; // Adjust the path as needed
import { ButtonGroup, GroupLeft, GroupRight } from './Container';

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;


const BoldedParagraph = styled.p`
  font-weight: bold;
`;

const ConfirmDialog = ({
  isOpen, message, onConfirm, onCancel,
  leftButtonText = "Kyllä", // Oletusteksti
  LeftButtonComponent = ConfirmDangerButton, // Oletuspainike
  RightButtonComponent = CancelButton, // Oletuspainike
  rightButtonText = "Peruuta", // Oletusteksti
  middleButtonText = "", //Oletuksena tyhjä
  MiddleButtonComponent = null, // Oletuksena tyhjä
  onMiddleButtonAction = null, // Oletuksena tyhjä

}) => {
  if (!isOpen) return null;

  return (
    <DialogOverlay>
    <DialogContainer>
      <BoldedParagraph>{message}</BoldedParagraph>
      <ButtonGroup>
        <GroupLeft>
          {/* Käytetään kutsujan määrittämää painikekomponenttia */}
          <LeftButtonComponent onClick={onConfirm}>
            {leftButtonText}
          </LeftButtonComponent>

          {MiddleButtonComponent && onMiddleButtonAction && (
            <>
              {/* Keskimmäinen painike näytetään vain, jos komponentti ja toiminto on määritelty */}
              <MiddleButtonComponent onClick={onMiddleButtonAction}>
                {middleButtonText}
              </MiddleButtonComponent>
            </>
          )}

        </GroupLeft>
        <GroupRight>
          {/* Käytetään kutsujan määrittämää peruutuspainikekomponenttia */}
          <RightButtonComponent onClick={onCancel}>
            {rightButtonText}
          </RightButtonComponent>
        </GroupRight>
      </ButtonGroup>
    </DialogContainer>
  </DialogOverlay>
  );
};

export default ConfirmDialog;
