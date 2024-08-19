import styled from 'styled-components';

export const ColorItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ColorItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 2px 2px 2px;
`;

export const ColorItem = styled.label`
  background-color: ${({ color }) => color.code || '#000'};
  color: ${({ color }) => color.name === 'Black' ? '#FFF' : '#000'};
  padding: 4px;
  width: 1px;
  height : 1px;
  margin-top: 0px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px; /* Tekstin koko */
  border: solid black 1px;
`;


export const ColorItemSelection = styled(ColorItem)`
  width: 26px;
  height : 18px;
  margin-right: 6px;
  margin-left: 10px;
  margin-top: 4px;
  filter: ${({ selected }) => (selected ? 'brightness(1.1)' : 'brightness(85%)')};
  outline: ${({ selected }) => (selected ? '1px solid black' : 'none')};
  border-radius: ${({ selected }) => (selected ? 'none' : '10px')};
`;


export const ColorCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-top: 0px;
`;