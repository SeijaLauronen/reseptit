import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

// Alkuperäinen ikoni
const FilterIcon = styled(FontAwesomeIcon)`  
  color: ${props => props.enabled ? '#09b55c' : '#929596'}; // #aaed9d, '#369e3b' : '#929596'
  font-size: 24px;
`;

// Ruksin sisältävä kontti
const IconWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 6px;
`;

// Ruksi (X) ikoni
const CrossIcon = styled(FontAwesomeIcon)`
  color: black;  
  color: ${props => props.enabled ? '#000' : '#666869'};
  font-size: 18x;
  position: absolute;
  top: 0;
  right: 0;  
  transform: translate(20%, -20%);
`;

const FilterWithCrossIcon = ({enabled, onClick }) => (
  <IconWrapper onClick={onClick} >
    <FilterIcon icon={faFilter} enabled = {enabled}/>
    <CrossIcon icon={faTimes} enabled = {enabled} />
  </IconWrapper>
);

export default FilterWithCrossIcon;


    
