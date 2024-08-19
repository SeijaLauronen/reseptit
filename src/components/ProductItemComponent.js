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

const ProductItemComponent = forwardRef(
  /* Huom, kun lisätään loogista koodia ja return, pitää olla seuraavan rivin lopussa aaltosulut. Kaarisulku, jos ei returnia : */
  ({ product, highlightText, filter, handleEditProduct, handleToggleFavorite, handleShoppingListPress, handleShoppingListRelease, handleTouchMove, handleContextMenu, colors, selectedColors }, ref) => {

    const noColor = { code: '#FFF', name: 'White' }; // Tämä voisi olla myös tuolla ylemäpänä
    const { colorCodingEnabled } = useSettings();  // Tämä laitetaan funktiokehykseen, on loogista koodia

    return (
      <div>
        <ProductListItem ref={ref}>

          {/* Ensimmäinen sarake: nimi ja värikoodit */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1' }}>
            <span>{highlightText(product.name, filter)}</span>

            {/* Näytetään värit vain jos tuotteelle on annettu jokin värikoodi */}
            {colorCodingEnabled && Object.keys(colors).some(colorKey => product[colorKey]) && (
              <ColorItemsWrapper>
                {
                  Object.keys(colors).map(colorKey => (                    
                    < ColorItemContainer key={colorKey} >
                      <ColorItem
                        color={product[colorKey] ? colors[colorKey] : noColor}>
                      </ColorItem>
                    </ColorItemContainer>
                  ))
                }
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
