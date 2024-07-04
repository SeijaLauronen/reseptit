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

export const ProductItem = styled(Item)`
`;

export const CategoryItem = styled(Item)`
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
