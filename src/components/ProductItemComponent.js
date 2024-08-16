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

const ProductItemComponent = forwardRef(
  ({ product, highlightText, filter, handleEditProduct, handleToggleFavorite, handleShoppingListPress, handleShoppingListRelease, handleTouchMove, handleContextMenu, colors, selectedColors }, ref) => (
    <div>
      <ProductListItem ref={ref}>

        {/* Tämä ekalle riville: */}
       
        <div className='ProductLine' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <span>{highlightText(product.name, filter)}</span>
          <div>
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
        </div>


        {/* Tämä toiselle riville: */}
        <div style={{ gridColumn: '1 / span 2' }}>
          < ColorItemsWrapper>
            {
              Object.keys(colors).map(colorKey => (
                <ColorItemContainer key={colorKey}>
                  <ColorItem color={colors[colorKey]}>
                  </ColorItem>
                </ColorItemContainer>
              ))
            }
          </ColorItemsWrapper >
        </div>



      </ProductListItem >


    </div >

  )
);

export default ProductItemComponent;
