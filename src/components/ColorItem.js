import styled from 'styled-components';

export const ColorItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ColorItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

export const ColorItem = styled.label`
  background-color: ${({ color }) => color.code || '#000'};
  color: ${({ color }) => color.name === 'Black' ? '#FFF' : '#000'};
  padding: 10px;
  width: 4px;
  height : 4px;
  margin-bottom: 5px;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px; /* Tekstin koko */
  


`;

export const ColorCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-top: 0px;
`;