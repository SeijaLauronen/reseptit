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
    background-color: #f5fdff; //hento sininen
`;

export const ProductListItem = styled(Item)`
  display: grid;
  grid-template-columns: 1fr auto; /* Kaksi saraketta: ensimmäinen sarake nimi+värit, toinen sarake ikonit */
  gap: 10px; /* Sarakkeiden väli */
  align-items: center; /* Kohdista ikonit keskelle pystysuunnassa */
  padding-bottom: 5px;
  margin: 2px 0;
`;

export const CategoryItem = styled(GrabbableItem)`
  padding-left: 10px;
  margin: 3px 0;
  font-size: large;  
  font-weight: bold;
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
  margin: 2px 0;
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
    align-items: flex-start;
    align-items: center;
  }
`;

export const DayProductItem = styled(ShoppingListItem)`
   margin: 2px 20px;
   margin-left: 40px;
`;

export const FineliDoseItem = styled(ShoppingListItem)`
   border:none;   
   margin-left: 0px;
   margin-top: 12px;
   padding-left: 0px; 
   padding-right: 0px; 

   /* Layout for the inner row used by ProductDoseFineliSelector */
   > div:first-child {
     display: flex;
     gap: 8px;
     align-items: center;
     width: 100%;
     flex-wrap: nowrap; /* default: keep all on one row */
   }

   /* Min column */
   > div:first-child > div:nth-child(1) {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
   }
   > div:first-child > div:nth-child(1) input[type="number"] {
     width: 55px;
     box-sizing: border-box;
   }

   /* Max column */
   > div:first-child > div:nth-child(2) {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
   }
   > div:first-child > div:nth-child(2) input[type="number"] {
     width: 55px;
     box-sizing: border-box;
   }

   /* Unit column takes remaining space */
   > div:first-child > div:nth-child(3) {
     flex: 1 1 auto;
     min-width: 0; /* allow to shrink if needed */
     max-width: 100%; // ettei mene yli
     display: flex;
     flex-direction: column;
   }
   > div:first-child > div:nth-child(3) select {
     width: 100%;
     min-width: 0; 
     max-width: 100%; // ettei mene yli
     box-sizing: border-box;
   }

   label {
     font-size: 12px;
   }

  @media (max-width: 300px) {
    > div:first-child {
      flex-wrap: wrap; /* allow wrapping on small screens */
      align-items: flex-start;
    }

    /* Keep Min and Max on the same row (fixed width) */
    > div:first-child > div:nth-child(1),
    > div:first-child > div:nth-child(2) {
      flex: 0 0 auto;
      order: 1;
      margin-right: 6px;
    }

    > div:first-child > div:nth-child(1) input[type="number"],
    > div:first-child > div:nth-child(2) input[type="number"] {
      width: 55px;
      box-sizing: border-box;
    }

    /* Unit drops below and takes full width */
    > div:first-child > div:nth-child(3) {
      flex-basis: 100%;
      order: 2;
      margin-top: 6px;
    }

    > div:first-child > div:nth-child(3) select {
      width: 100%;
      box-sizing: border-box;
    }
  }
`;

export const DayClassItem = styled.div`
  margin: 2px 20px;
  padding: 6px ; 
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
  border: none;
  background-color: #fff;  
  margin-left: 5px;;  
`;

export const TextItem = styled.span`
  // Tekstin rivittymisen asetukset
  overflow-wrap: break-word; // Mieluummin katkaisee sanojen välistä
  word-break: break-word; // Katkaisee sanan keskeltä vain tarvittaessa
`;