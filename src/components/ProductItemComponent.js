/* 
forwardRef on Reactin funktio, jonka avulla voi välittää ref-referenssin komponentin läpi sen lapsikomponentille tai DOM-elementille. 
Tällöin vanhempi komponentti pääsee käsiksi johonkin lapsikomponentin DOM-elementtiin tai instanssiin, 
vaikka komponenttihierarkian välissä on komponentteja, jotka muuten estäisivät suoran pääsyn.
*/

import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faShoppingCart, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { IconContainer, IconWrapper } from '../components/Container';
import { ProductListItem } from './Item';
import { ColorItemsWrapper, ColorItemContainer, ColorItem } from '../components/ColorItem';
import { useSettings } from '../SettingsContext';
import styled from 'styled-components';
import { useProductClass } from '../ProductClassContext';
import { TextItem } from './Item';


const StyledText = styled.span` 
 font-size: 0.8em;
 margin-left: 2px;
`;

const ProductItemComponent = forwardRef(
  /* Huom, kun lisätään loogista koodia ja return, pitää olla seuraavan rivin lopussa aaltosulut. Kaarisulku, jos ei returnia : */
  ({ product, highlightText, filter, handleEditProduct, handleToggleFavorite, handleShoppingListPress, handleShoppingListRelease, handleTouchMove, handleContextMenu, colors, selectedColors }, ref) => {

    const noColor = { code: '#FFF', name: 'White' }; // Tämä voisi olla myös tuolla ylemäpänä
    const { colorCodingEnabled, showDose, showProductClass } = useSettings();  // Tämä laitetaan funktiokehykseen, on loogista koodia
    const { productClasses } = useProductClass(); // Hook, otetaankin täältä eikä Product.js:n kautta

    const renderAdditionalInfoText = () => {
      return (
        <StyledText>
          {showProductClass && product.classId &&
            productClasses.find(pc => pc.id === product.classId)?.name
            ? `${productClasses.find(pc => pc.id === product.classId).name}`
            : ''}
          {showDose && product.dose ? ` (${product.dose})` : ''}
        </StyledText>
      )
    }

    const productHasColors = Object.keys(colors).some(colorKey => product[colorKey]);
    return (
      <div>
        <ProductListItem ref={ref}>          

          {/* Ensimmäinen sarake: nimi ja värikoodit ja lisätiedot */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1' }}>
            <TextItem>{highlightText(product.name, filter)}
              {(!colorCodingEnabled || !productHasColors) && renderAdditionalInfoText()}
            </TextItem>

            {/* Näytetään värit vain jos tuotteelle on annettu jokin värikoodi */}
            {colorCodingEnabled && productHasColors && (
              <ColorItemsWrapper className='colorItemsWrapper'>
                {
                  Object.keys(colors).map(colorKey => (
                    < ColorItemContainer key={colorKey} className='colorItemContainer'>
                      <ColorItem
                        color={product[colorKey] ? colors[colorKey] : noColor}>
                      </ColorItem>
                    </ColorItemContainer>
                  ))

                }
                {renderAdditionalInfoText()}
              </ColorItemsWrapper>
            )}

          </div>

          {/* Toinen sarake: ikonit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gridColumn: '2' }}>
            <IconContainer className='iconContainer'>
              <IconWrapper onClick={() => handleEditProduct(product)}>
                <FontAwesomeIcon icon={faEdit} />
              </IconWrapper>
              <IconWrapper onClick={() => handleToggleFavorite(product.id)}>
                <FontAwesomeIcon
                  icon={product.isFavorite ? faStarSolid : faStarRegular}
                  style={{ color: product.isFavorite ? 'gold' : 'gray' }}
                />
              </IconWrapper>
              <IconWrapper
                onTouchStart={(e) => handleShoppingListPress(e, product)}
                onTouchEnd={(e) => handleShoppingListRelease(e, product)}
                onTouchMove={(e) => handleTouchMove(e)}
                onMouseDown={(e) => handleShoppingListPress(e, product)}
                onMouseUp={(e) => handleShoppingListRelease(e, product)}
                onContextMenu={(e) => handleContextMenu(e)} // Estää oikean painikkeen valikon
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  style={{ color: product.onShoppingList ? 'green' : 'lightgrey' }}
                />

              </IconWrapper>
            </IconContainer>
          </div>

        </ProductListItem >
      </div >
    );
  }
);

export default ProductItemComponent;
