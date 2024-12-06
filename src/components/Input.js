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
    width: 40px;   
    &::placeholder {
    font-size: 9px; /* Pienennä placeholder-tekstin kokoa */
    /*color: #999;*/ /* Vaihda tarvittaessa placeholderin väri */
  }   
`;

export const InputUnit = styled(Input)`
    width: 40px;    
    &::placeholder {
    font-size: 9px; /* Pienennä placeholder-tekstin kokoa */    
  }    
`;

export const InputName = styled(Input)`
   margin-left: 10px;
   width: 200px;   
`;

export const InputColorShortName = styled(Input).attrs({
    maxLength: 6 // maksimimerkkimäärä
})`
    width: 50px;      
`;

export const Select = styled.select`
  padding-left: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  width: 180px;
`;

export const InputTextArea = styled.textarea`
  width: 80%;
  height: 180px;
  margin: 2px 15px;
`;