import styled from 'styled-components';
//#ffffc4 vaalea keltainen
//#e1f5eb vaalea vihreä
//#673ab7 violetti
//#daf7f7 vaalea turkoosi

const StickyTop = styled.div`

    position: fixed;
    top: 52px;
    left: 0;
    background-color: #e1f5eb;
    padding: 6px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;    
    width: 100%;
    box-sizing: border-box; /* Ensure padding is included in width */
    min-height: 50px;
    z-index: 999;

`;

export default StickyTop;

export const ProductStickyTop = styled(StickyTop)`

  display: grid;
  grid-template-rows: auto auto ; /* Kaksi riviä */
  grid-template-rows: ${({ $showFilterRow }) => ($showFilterRow ? 'auto auto' : 'auto ')}; /* Yksi tai kaksi riviä */
  grid-template-columns: 1fr auto; /* Kaksi saraketta: ensimmäinen sarake nimi+värit, toinen sarake ikonit */
  gap: 10px; /* Sarakkeiden väli */
  align-items: center; /* Kohdista ikonit keskelle pystysuunnassa */
  padding-left: 10px;
  padding-bottom: 5px;

  .topHeader{
    grid-column: 1 / span 2; /* Vie koko rivin */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-switch {
    display: flex;
    align-items: center;
    gap: 10px; /* Väli labelin ja switchin välillä */
  }
  
  /* Alempi rivi showFilterRow */
  .filter-row {
    grid-column: 1 / span 2; /* Vie koko rivin */
    display: flex;
    gap: 10px; /* Väli elementtien välillä */
    //border: solid grey 1px;
    background-color:#bfe0c8;//#f1f2bd; //'#447877'; //'#bfe0c8'; //#edfaf1;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    padding-left: 8px;
    padding-top: 6px;
    padding-bottom: 2px;
  }

`;


