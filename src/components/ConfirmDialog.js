import React from 'react';
import styled from 'styled-components';
import { ConfirmDangerButton, CancelButton } from './Button'; // Adjust the path as needed
import {ButtonGroup, GroupLeft, GroupRight} from './Container';

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

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <DialogOverlay>
      <DialogContainer>
        <BoldedParagraph>{message}</BoldedParagraph>
        <ButtonGroup>
          <GroupLeft>
            <ConfirmDangerButton onClick={onConfirm}>Kyllä</ConfirmDangerButton>
          </GroupLeft>
          <GroupRight>
            <CancelButton onClick={onCancel}>Peruuta</CancelButton>
          </GroupRight>
        </ButtonGroup>
      </DialogContainer>
    </DialogOverlay>
  );
};

export default ConfirmDialog;
