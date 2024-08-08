import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faSave, faTimes, faPlus, faQuestion, faCopy, faPaste, faShare } from '@fortawesome/free-solid-svg-icons';

const Button = styled.button`
  background-color: ${props => (props.disabled ? '#ccc' : props.bgColor || '#007BFF')};
  color: ${props => (props.disabled ? '#666' : props.color || 'white')};
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: 1;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : props.hoverBgColor || '#0056b3')};
  }

  svg {
    font-size: 14px;
  }
  width: ${props => (props.fullwidth ? '100%' : 'auto')}; 
`;


const ButtonComponent = ({ icon, children, defaultText, ...props }) => (
  <Button {...props}>
    {icon && <FontAwesomeIcon icon={icon} />}
    {children || defaultText}
  </Button>
);

export default ButtonComponent;


const CloseButton = styled.div`
padding: 10px;
text-align: right;
cursor: pointer;
background-color: white;
`;

export const CloseButtonComponent = ({ ...props }) => (
  <CloseButton >
    <FontAwesomeIcon icon={faTimes} size="1x" onClick={props.onClick} />
  </CloseButton>
);


const IconButtonGreen = styled(({ icon, defaultText, ...props }) => (
  <ButtonComponent icon={icon} defaultText={defaultText} {...props} />
))`
  background-color: ${props => (props.disabled ? '#ccc' : props.bgColor || '#4caf50')};
  
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : props.hoverBgColor || '#388e3c')};
  }
  &:active,
  &:focus {
    background-color: ${props => (props.disabled ? '#ccc' : props.bgColor || '#4caf50')};
  }
`;

export const SaveButton = (props) => <IconButtonGreen icon={faSave} defaultText="Tallenna" {...props} />;
export const OkButton = (props) => <IconButtonGreen icon={faCheck} defaultText="OK" {...props} />;
export const CopyButton = (props) => <IconButtonGreen icon={faCopy} defaultText="Kopioi" {...props} />;
export const PasteButton = (props) => <IconButtonGreen icon={faPaste} defaultText="Liitä" {...props} />;
export const ShareButton = (props) => <IconButtonGreen icon={faShare} defaultText="Jaa" {...props} />;
export const AddButton = (props) => <IconButtonGreen icon={faPlus} defaultText="" {...props} />;

export const CancelButton = styled(props => (
  <ButtonComponent icon={faTimes} defaultText="Peruuta" {...props} />
))`
  background-color: #cbcec9;
  color: black;
  &:hover {
    background-color: #a8a9a8;
  }
`;

export const ConfirmDangerButton = styled(props => (
  <ButtonComponent defaultText="Kyllä" {...props} />
))`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
  margin-left: auto;
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


export const HelpButton = styled(props => (
  <ButtonComponent icon={faQuestion} defaultText="" {...props} />
))`
    background-color: #007BFF;
    &:hover {
      background-color: #0056b3;
    }
    margin-left: auto;    
  `;

export const MenuHelpButton = styled(props => (
  <ButtonComponent icon={faQuestion} defaultText="" {...props} />
))`
  background-color: #007BFF;
  &:hover {
    background-color: #0056b3;
  }
  margin-left: auto; 
  margin-right: 30px;    
`;

export const PrimaryButton = styled(ButtonComponent)`
  background-color: ${props => (props.disabled ? '#ccc' : '#007BFF')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#0056b3')};
  }  
`;

