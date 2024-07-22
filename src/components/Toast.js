import React from 'react';
import styled from 'styled-components';

const ToastWrapper = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  background-color: #ff0000;
  color: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ToastMessage = styled.div`
  margin-right: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`;

const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <ToastWrapper>
      <ToastMessage>{message}</ToastMessage>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastWrapper>
  );
};

export default Toast;
