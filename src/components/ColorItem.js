import styled from 'styled-components';

export const ColorItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center; 
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

  /* background-color: ${({ color }) => color.code || '#000'}; */  
  /* color: ${({ color }) => color.name === 'Black' ? '#FFF' : '#000'};*/ // Tämä oli jo kommentoituna, tuo ylempi oli voimassa
export const ColorItem = styled.label`
  background-color: ${({ color }) => (color?.code ? color.code : 'transparent')};
  color: ${({ color }) => {
    if (!color) return '#000'; /* Musta teksti oletuksena, jos ei välitetty color-tietoa ollenkaan */
    switch (color.name) {
      case 'Black':
      case 'Red':
      case 'Green':
        return '#FFF';
      default:
        return '#000';
    }
  }};
  padding: 2.3px; /* Tässä saa pikkuneliöitten kokoa muutettua*/
  width: 1px;
  height : 1px;
  margin-top: 0px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px; /* Tekstin koko, kts myös ColorItemSelection! */  
  font-weight: ${({ color }) => {
    if (!color) return 'normal'; /* Normaali fontti oletuksena, jos ei välitetty color-tietoa ollenkaan */
    switch (color.name) {
      case 'Black':
      case 'Red':
      case 'Green':
      case 'Yellow':
        return 'bold';
      default:
        return 'normal';
    }
  }};

  border: solid black 1px;
`;

//Värifiltteririvin itemitason määritykset Tuotesivulla ja Editissä
// border: ${({ color }) => color.code || '#000'};
export const ColorItemSelection = styled(ColorItem)`
  padding: 4px;
  font-size: 13px; /* Tekstin koko */
  width: 38px; /* 26 */
  height : 12px;
  margin-right: 1px; /* 4 */
  margin-left: 1px; /* 4 */
  margin-top: 4px;
  //border: solid grey 1px;  

  border: ${({ color }) => (color?.code ? color.code : '#000')}; 
  filter: ${({ color, selected }) =>
    color?.name === 'NoColor'
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


export const ColorItemInTitle = styled(ColorItemSelection)`
  margin-right: 8px;
  padding-bottom: 12px;
  padding-left: 15px;
  padding-right: 15px;
  display: inline-block;
`;

export const ColorItemDroppable = styled(ColorItemSelection)`
  margin-right: 8px;
  padding-bottom: 8px;
  padding-left: 25px;
  padding-right: 25px;
  display: inline-block; // Elementit rinnakkain
  white-space: nowrap; // Estää tekstin rivittymisen 
  overflow: hidden; // estää ylivuodon 
  //text-overflow: ellipsis; // Näyttää kolme pistettä, jos teksti ei mahdu 
  justify-content: center; // Vaakasuuntainen keskitys 
  width: 60px;
  align-items: center; /* Keskittää sisällön pystysuunnassa */
  height: 15px; /* Vakio korkeus */

`;

export const ColorCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-top: 0px;
`;