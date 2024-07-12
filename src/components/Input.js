import styled from "styled-components";

const Input = styled.input`
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px; 
    margin: 2px;
    flex:1;     //Ottaa kaiken jäljellä olevan tilan  
`;

const InputAdd = styled(Input)`
    width: -webkit-fill-available;       
`;
export default InputAdd;

export const InputQuantity = styled(Input)`
    width: 60px;      
`;

export const InputUnit = styled(Input)`
    width: 50px;      
`;

export const InputName = styled(Input)`
   margin-left: 10px;
   width: 200px;   
`;

export const Select = styled.select`
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  width: 180px;
`;


