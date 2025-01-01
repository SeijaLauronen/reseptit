import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.span`
  padding: 1px 4px;
  margin:  2px 2px;
  cursor: pointer;
  border: 1px solid ${({ isSelected }) => (isSelected ? 'blue' : 'gray')};
  background-color: ${({ isSelected }) => (isSelected ? '#cce5ff' : 'white')};
  border-radius: 5px;
`;

const ItemToggle = ({ product, onSelect }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    const newState = !isSelected;
    setIsSelected(newState);
    onSelect(product, newState);
  };

  return (
    <ToggleContainer onClick={handleClick} isSelected={isSelected}>
      {product.name}
    </ToggleContainer>
  );
};

export default ItemToggle;

export const ItemToggleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;  
`;
