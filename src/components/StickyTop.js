import styled from 'styled-components';

const StickyTop = styled.div`

    position: fixed;
    top: 52px;
    left: 0;
    background-color: #ffffc4;
    padding: 6px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;    
    width: 100%;
    box-sizing: border-box; /* Ensure padding is included in width */
    min-height: 50px;
    z-index: 999;

`;

export default StickyTop;

export const ProductStickyTop = styled(StickyTop) `

  display: grid;
  grid-template-rows: auto auto ; /* Kaksi riviä */
  grid-template-rows: ${({ $showFilterRow }) => ($showFilterRow ? 'auto auto' : 'auto ')}; /* Yksi tai kaksi riviä */
  grid-template-columns: 1fr auto; /* Kaksi saraketta: ensimmäinen sarake nimi+värit, toinen sarake ikonit */
  gap: 10px; /* Sarakkeiden väli */
  align-items: center; /* Kohdista ikonit keskelle pystysuunnassa */
  padding-bottom: 5px;

  .topHeader{
    grid-column: 1 / span 2; /* Vie koko rivin */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* Alempi rivi showFilterRow */
  .filter-row {
    grid-column: 1 / span 2; /* Vie koko rivin */
    display: flex;
    //display: ${({ $showFilterRow }) => $showFilterRow ? 'flex' : 'none'};
    //visibility: ${({ $showFilterRow }) => $showFilterRow ? 'visible' : 'hidden'};
    gap: 10px; /* Väli elementtien välillä */
  }

`;


