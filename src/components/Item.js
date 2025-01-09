import styled from "styled-components";

const Item = styled.div`
  padding-left: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  //background-color: green;
  //word-wrap: break-word;
  //word-break: break-all;
  // Tekstin rivittymisen asetukset
  overflow-wrap: break-word; // Mieluummin katkaisee sanojen välistä
  word-break: break-word; // Katkaisee sanan keskeltä vain tarvittaessa
`;
export default Item;

export const GrabbableItem = styled(Item)`

  cursor: grab; /* "Grab" kursori */
  &:active {
    cursor: grabbing; /* "Grabbing" kursori, kun itemiä vedetään */    
  }
  
  box-shadow: 
    inset 0 4px 6px rgba(0, 0, 0, 0.1),  /* Sisäinen yleinen varjo */
    inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Sisäinen hieno varjo */
`;

export const ProductListItem = styled(Item)`
  display: grid;
  grid-template-columns: 1fr auto; /* Kaksi saraketta: ensimmäinen sarake nimi+värit, toinen sarake ikonit */
  gap: 10px; /* Sarakkeiden väli */
  align-items: center; /* Kohdista ikonit keskelle pystysuunnassa */
  padding-bottom: 5px;
`;

export const CategoryItem = styled(GrabbableItem)`
`;

export const ProductClassSelectionHeader = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: bold;
  padding-left: 10px;
  margin: 10px 0;
`;

export const ProductClassSelectItem = styled.div`
padding-left: 10px;
  margin: 10px 0;
  display: flex;
  gap: 10px;
  align-items: center;
  // Tekstin rivittymisen asetukset
  overflow-wrap: break-word; // Mieluummin katkaisee sanojen välistä
  word-break: break-word; // Katkaisee sanan keskeltä vain tarvittaessa

  input[type="text"] {
    width: 90px; 
  }

`;

export const ProductClassItemGrabbable = styled(GrabbableItem)`
  // grabbale asemointi ei toiminut sliding-containerilla jossa käytetään translatea. Piti vaihtaa slidin container toisenlaiseen
  // transform: translateX(0) !important;
  // position: absolute;
  padding-left: 5px;
  padding-right: 2px;
  margin: 2px 20px 2px 2px; 
  border: 1px solid #ccc;
  border-radius: 4px;  
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;  
`;

export const ShoppingListItem = styled(Item)`
  padding-left: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  //background-color: red;

  @media (min-width: 300px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const TextItem = styled.span`
  // Tekstin rivittymisen asetukset
  overflow-wrap: break-word; // Mieluummin katkaisee sanojen välistä
  word-break: break-word; // Katkaisee sanan keskeltä vain tarvittaessa
`;