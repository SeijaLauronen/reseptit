import styled from 'styled-components';

export const ClassTitleStyled = styled.span`
  font-weight: bold;
  font-size: medium;
  //color: #1f227a;
  color: #3d43e3;
`;

export const MealTitleStyled = styled.span`
  font-weight: bold;
  font-size: large;
`;

export const DayTitleStyled = styled.span`
  font-weight: bold;
  font-size: larger;
  color: ${(props) => (props.$active ? 'black' : 'grey')};
`;

export const DayTitleWrapper = styled.div` 
  display: flex;  
  align-items: center;  

  .activemark {    
    cursor: pointer;
    margin-right: 14px;
    display: inline-flex;
    align-items: center;                             
  }
`;