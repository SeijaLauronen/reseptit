import styled from 'styled-components'; 


//DOM-elementtiin liittyvä styled-component: Käytetään transientteja propseja, eli $ "isJotain" eteen, jotta ne eivät välity tuntemattomina DOM:lle
const Container = styled.div`
  padding: 55px 5px;
  opacity: ${({ $isMenuOpen, $isCategoryFormOpen, $isEditFormOpen, isPrintOpen }) => ($isMenuOpen || $isCategoryFormOpen || $isEditFormOpen || isPrintOpen ? 0.5 : 1)};
  pointer-events: ${({ $isMenuOpen, $isCategoryFormOpen, $isEditFormOpen, isPrintOpen }) => ($isMenuOpen || $isCategoryFormOpen || $isEditFormOpen || isPrintOpen ? 'none' : 'auto')};
  transition: opacity 0.3s ease-in-out;
  //background-color: green;
`;
export default Container;


export const FormContainer = styled.div`
padding: 20px;
background-color: #fff;
margin: 20px 0;
//background-color: blue;
`;

export const ScrollableFormContainer = styled(FormContainer)`
  display: flex;
  flex-direction: column;    
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 50vh;
  //max-height: calc(100vh - 80px); // Asetetaan maksimi korkeus suhteessa näkymän korkeuteen ja vähennetään ylä- ja ala-marginaalit
  overflow-y: auto; // Ota käyttöön pystysuuntainen vieritys 
  margin-bottom: 5px;
`;

export const SlideInContainerRight = styled.div`
  position: fixed;
  top: 100px;
  right: 0;
  width: 90%;
  max-width: 400px;
  height: auto;
  padding: 10px; 
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});  
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  overflow-y: auto;  
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
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  padding: 0px 4px;
  cursor: pointer;
  user-select: none; // Estää tekstin valinnan 
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

export const GroupLeft = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: ${props => (props.fillspace ? '1' : 'auto')}; 
`;

export const GroupRight = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex: 1;
  min-width: 0; /* Allow flex items to shrink to fit */
`;

