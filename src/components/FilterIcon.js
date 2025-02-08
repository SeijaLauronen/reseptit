import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

// Alkuperäinen ikoni
const FilterIcon = styled(FontAwesomeIcon)`  
  color: ${props => props.$filterEnabled ? '#09b55c' : '#929596'}; // #aaed9d, '#369e3b' : '#929596'
  font-size: 22px;
`;

// Ruksin sisältävä kontti
const IconWrapper = styled.div`
  margin-top: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
  position: relative;
  //display: inline-block; 
  display: flex;
  flex-direction: column;
  min-width: 36px; /* Kiinteä leveys pitää elementit linjassa */  
  border-radius: ${props => (props.$filterEnabled ? '4px' : '0')};
  transition: all 0.3s;

  //Ulkoinen varjo, Sisäinen varjo: Vaaka-siirtymä, Pysty-siirtymä, Sumennus-säde, Leviämis-säde
  box-shadow: ${props => props.$filterEnabled
    ? `0px 4px 8px rgba(0, 0, 0, 0), inset 0px -1px 4px 2px rgba(0, 0, 0, 0.2)`
    : 'none'};

  &:hover {
    background-color: ${props => (props.$filterEnabled ? '#c7ffc7' : 'transparent')};
    border-color: ${props => (props.$filterEnabled ? '#09b55c' : 'transparent')};
  }  
`;

// Ruksi (X) ikoni, original
const CrossIcon = styled(FontAwesomeIcon)`
  color: black;  
  color: ${props => props.$filterEnabled ? '#000' : '#666869'};
  font-size: 18x;
  position: absolute;
  top: 0;
  right: 0;  
  transform: translate(-50%, -20%);
`;

const FilterCount = styled.span`
  color: ${props => props.$filterEnabled ? '#000' : '#666869'};
  font-size: 12px;
  margin-top: 2px;
  font-weight: bold;
  position: absolute;
  top: 8px; /* Aseta tarkasti ruksiin suhteutettu etäisyys */
  right: 3px; 
`;

const FilterText = styled.span`
  margin-left: 0px; /* Väli ikonin ja tekstin välillä */
  color: ${props => props.$filterEnabled ? '#000' : '#666869'};
  font-size: 10px;
`;


// Todo nämä voisi yhdistää yhdeksi komponentiksi, jossa on parametrina icon ja filtertext
export const SearchWithCrossIcon = ({ $filterEnabled, onClick, count, filtertext }) => (
  <IconWrapper onClick={onClick} $filterEnabled={$filterEnabled} className='SearchIcon-IconWrapper'>
    <FilterIcon icon={faMagnifyingGlass} $filterEnabled={$filterEnabled} />
    <CrossIcon icon={faTimes} $filterEnabled={$filterEnabled} />
    <FilterText $filterEnabled={$filterEnabled}>
      {filtertext || "Etsi"}
    </FilterText>
    {count > 0 && <FilterCount>{count}</FilterCount>}
  </IconWrapper>
);


const FilterWithCrossIcon = ({ $filterEnabled, onClick, count, filtertext }) => (
  <IconWrapper onClick={onClick} $filterEnabled={$filterEnabled} className='FilterIcon-IconWrapper'>
    <FilterIcon icon={faFilter} $filterEnabled={$filterEnabled} />
    <CrossIcon icon={faTimes} $filterEnabled={$filterEnabled} />
    <FilterText $filterEnabled={$filterEnabled}>
      {filtertext || "Suodatus"}
    </FilterText>
    {count > 0 && <FilterCount>{count}</FilterCount>}
  </IconWrapper>
);

export default FilterWithCrossIcon;



