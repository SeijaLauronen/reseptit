import styled from 'styled-components';

// Käytä transienttia propsia $isitemselected Styled Componentsille, eli dollari eteen
const ToggleContainer = styled.span`
  padding: 1px 4px;
  margin:  2px 2px;
  cursor: pointer;
  border: 1px solid ${({ $isitemselected }) => ($isitemselected ? 'blue' : 'gray')};
  background-color: ${({ $isitemselected }) => ($isitemselected ? '#cce5ff' : 'white')};
  border-radius: 5px;
`;

const ItemToggle = ({ item, print, isItemSelected, onSelect }) => {  

  const handleClick = () => {
    const newState = !isItemSelected;    
    onSelect(item, newState);
  };

  return (
    <ToggleContainer onClick={handleClick} $isitemselected={isItemSelected}>
      {print}
    </ToggleContainer>
  );
};

export default ItemToggle;

export const ItemToggleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;  
`;
