import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

// Alkuperäinen ikoni
const FilterIcon = styled(FontAwesomeIcon)`  
  color: ${props => props.enabled ? '#09b55c' : '#929596'}; // #aaed9d, '#369e3b' : '#929596'
  font-size: 22px;
`;

// Ruksin sisältävä kontti
const IconWrapper = styled.div`
  margin-top: 4px;
  position: relative;
  //display: inline-block; 
  display: flex;
  flex-direction: column;
`;

// Ruksi (X) ikoni
const CrossIcon = styled(FontAwesomeIcon)`
  color: black;  
  color: ${props => props.enabled ? '#000' : '#666869'};
  font-size: 18x;
  position: absolute;
  top: 0;
  right: 0;  
  transform: translate(-50%, -20%);
`;

const FilterText = styled.span`
  margin-left: 0px; /* Väli ikonin ja tekstin välillä */
  color: ${props => props.enabled ? '#000' : '#666869'};
  font-size: 10px;
`;

const FilterWithCrossIcon = ({enabled, onClick }) => (
  <IconWrapper onClick={onClick} >
    <FilterIcon icon={faFilter} enabled = {enabled}/>
    <CrossIcon icon={faTimes} enabled = {enabled} />
    <FilterText enabled={enabled}>Valinnat</FilterText>
  </IconWrapper>
);

export default FilterWithCrossIcon;


    
