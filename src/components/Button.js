import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => (props.disabled ? '#ccc' : '#007BFF')};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: 1;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#0056b3')};
  }
`;

export default Button;

//TODO jos disabloitu...
const ButtonXYZ = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const SaveButton = styled(Button)`
  background-color: #4caf50;
  color: white;
`;

export const CancelButton = styled(Button)`
  background-color: #cbcec9;
  color: black;
`;

export const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: white;
  margin-left: auto;
`;



export const PrimaryButton = styled(Button)`
  background-color: ${props => (props.disabled ? '#ccc' : '#007BFF')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#0056b3')};
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: ${props => (props.disabled ? '#ccc' : '#6c757d')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#5a6268')};
  }
`;

export const DangerButton = styled(Button)`
  background-color: ${props => (props.disabled ? '#ccc' : '#dc3545')};
  &:hover {
    background-color: ${props => (props.disabled ? '#ccc' : '#c82333')};
  }
`;
