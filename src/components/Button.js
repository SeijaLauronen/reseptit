import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'; // Importing default icons

const Button = styled.button`
  background-color: ${props => (props.disabled ? '#ccc' : props.bgColor || '#007BFF')};
  color: ${props => (props.disabled ? '#666' : props.color || 'white')};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: 1;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : props.hoverBgColor || '#0056b3')};
  }

  svg {
    font-size: 20px;
  }
`;

const ButtonComponent = ({ icon, children, defaultText, ...props }) => (
  <Button {...props}>
    {icon && <FontAwesomeIcon icon={icon} />}
    {children || defaultText}
  </Button>
);

export default ButtonComponent;


export const SaveButton = styled(props => (
  <ButtonComponent icon={faSave} defaultText="Tallenna" {...props} />
))`
  background-color: #4caf50;
  &:hover {
    background-color: #388e3c;
  }
`;

export const CancelButton = styled(props => (
  <ButtonComponent icon={faTimes} defaultText="Peruuta" {...props} />
))`
  background-color: #cbcec9;
  color: black;
  &:hover {
    background-color: #a8a9a8;
  }
`;

export const DeleteButton = styled(props => (
  <ButtonComponent icon={faTrash} defaultText="Poista" {...props} />
))`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
  margin-left: auto;
`;


export const AddButton = styled(props => (
    <ButtonComponent icon={faPlus} defaultText="Lisää" {...props} />
  ))`
    background-color: ${props => (props.disabled ? '#ccc' : '#4caf50')};
    &:hover {
      background-color: ${props => (props.disabled ? '#ccc' : '#388e3c')};
    }
  `;


export const PrimaryButton = styled(ButtonComponent)`
  background-color: ${props => (props.disabled ? '#ccc' : '#007BFF')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#0056b3')};
  }
`;

export const SecondaryButton = styled(ButtonComponent)`
  background-color: ${props => (props.disabled ? '#ccc' : '#6c757d')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#5a6268')};
  }
`;

export const DangerButton = styled(ButtonComponent)`
  background-color: ${props => (props.disabled ? '#ccc' : '#dc3545')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#c82333')};
  }
`;
