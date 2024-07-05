import styled from 'styled-components'; 

const Container = styled.div`
  padding: 45px 5px;
  opacity: ${({ isMenuOpen, isCategoryFormOpen, isEditFormOpen }) => (isMenuOpen || isCategoryFormOpen || isEditFormOpen ? 0.5 : 1)};
  pointer-events: ${({ isMenuOpen, isCategoryFormOpen, isEditFormOpen }) => (isMenuOpen || isCategoryFormOpen || isEditFormOpen ? 'none' : 'auto')};
  transition: opacity 0.3s ease-in-out;
  //background-color: green;
`;
export default Container;

export const FormContainer = styled.div`
padding: 20px;
background-color: #fff;
margin: 20px 0;
`;

export const IconContainer = styled.span`
  display: inline-flex;
  flex-direction: column;
  //background-color: yellow;
  padding: 10px 0px;
  @media (min-width: 300px) {
    flex-direction: row;    
  }
`;

export const IconWrapper = styled.span`
  margin-left: 20px;
  margin-right: 10px;
  margin-top: 10px;
  padding: 0px 10px;
  cursor: pointer;
  //background-color: blue;
  @media (min-width: 300px) {   
    margin-top: 0px;
  }
`;

//Wrapper for quantity and unit inputs
export const InputWrapper = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 10px;
  //background-color: blue;
  padding: 5px;

  @media (min-width: 300px) {
    flex-direction: row;    
  }
`;


export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

// Button group styles
export const ButtonGroupLeft = styled.div`
  display: flex;
`;

export const ButtonGroupRight = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex: 1;
  min-width: 0; /* Allow flex items to shrink to fit */
`;

