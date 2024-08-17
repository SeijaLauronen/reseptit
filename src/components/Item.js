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
  word-wrap: break-word;
  word-break: break-all;
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
