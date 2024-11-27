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

export const ColorItemContainerLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 0px 2px 2px;
  padding: 6px 0px 2px 2px;
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

//Värifiltteririvin määritykset Tuotesivulla
export const ColorItemSelection = styled(ColorItem)`
  font-size: 12px; /* Tekstin koko */
  width: 38px; /* 26 */
  height : 12px;
  margin-right: 1px; /* 4 */
  margin-left: 1px; /* 4 */
  margin-top: 4px;
  //border: solid grey 1px;  
  border: ${({ color }) => color.code || '#000'};
  filter: ${({ color, selected }) => 
    color.name === 'NoColor' 
      ? undefined 
      : selected 
        ? 'brightness(1.1)' 
        : 'brightness(85%)'};
  outline: ${({ selected }) => (selected ? '1px solid black' : 'none')};
  border-radius: ${({ selected }) => (selected ? 'none' : '10px')};
  box-shadow: 
    0px 4px 8px rgba(0, 0, 0, 0), //Ulkoinen varjo
    inset 0px -1px 4px 2px rgba(0, 0, 0, 0.2); // Sisäinen varjo: Vaaka-siirtymä, Pysty-siirtymä, Sumennus-säde, Leviämis-säde
`;


export const ColorCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-top: 0px;
`;