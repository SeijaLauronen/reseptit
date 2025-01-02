import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import EditProductForm from './forms/EditProductForm';
import Accordion from '../components/Accordion';
import { ProductStickyTop } from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import Container, { ProductContainer, IconWrapper } from '../components/Container';
import { getCategories, getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controller';
import Toast from '../components/Toast';
import ProductItemComponent from '../components/ProductItemComponent';
import { useColors } from '../ColorContext';
import { ColorItemsWrapper, ColorItemContainer, ColorItemSelection } from '../components/ColorItem';
import { useSettings } from '../SettingsContext';
import FilterWithCrossIcon from '../components/FilterIcon';
import SwitchButtonComponent from '../components/SwitchButtonCompnent';
import { useProductClass } from '../ProductClassContext'; // Hook

// TODO kun tekee refresh ja menee tuotesivulle, tulee (filteri-ikonista?):
// Received `false` for a non-boolean attribute `enabled`.
// If you want to write it to the DOM, pass a string instead: enabled="false" or enabled={value.toString()}.
// TODO ostoskorin klikkamisesta tulee "Passiivinen kuuntelija virhe" e.PreventDefaultista...

const Products = ({ refresh = false, categoryId }) => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingProductAmount, setEditingProductAmount] = useState(false);;
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId); //Lisäsin tämän
  const [selectedCategoryName, setSelectedCategoryName] = useState(''); //tämä lisätty
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState('');
  const [handledProductId, setHandledProductId] = useState(null); // ID of the newly added or edited product
  const isShopLongPressRef = useRef(false); //useRef  -hook: onko käyttäjä tehnyt pitkän painalluksen. useRef -arvo ei muutu uudelleenrenderöintien välillä, joten se säilyttää tilansa koko komponentin elinkaaren ajan.
  const { colorCodingEnabled, openQuantityByLongPress } = useSettings();
  const { colors, selectedColors, toggleColor, setSelectedColors, colorDefinitions, noColor } = useColors(); //Hook For filtering in Products

  const productRefs = useRef({}); // Ref object to hold references to product items


  //const [productClasses, setProductClasses] = useState([]); // Ei näin, että haetaan täällä niitä erikseen
  const { fetchAndSetProductClasses } = useProductClass();  //Käytetään Hook:ia, että saadaan mahdollisesti päivitetyt tiedot käyttöön heti. itemissä käytetään suoraan productClasses, ei välitetä täältä
  
  useEffect(() => { 
    fetchAndSetProductClasses(); // Haetaan tuoteryhmät kertaalleen, kun tullaan tälle näkymälle. Hookin kautta päivittyvät,, jos niitä on muutettu
  },[]); // TODO pitääkö laittaa fetchAndSetProductClasses


  // Muut setting:sit ovat tuolla SettinsContextissa, mutta tätä käytetään vain tässä paikallisesti....
  // Tila alustetaan localStoragesta, jossa etsitään 'productView' arvoa
  const [showByCategory, setShowByCategory] = useState(() => {
    const saved = localStorage.getItem('productView');
    // Tarkistetaan, sisältääkö saved-arvo 'showByCategory'
    return saved === 'showByCategory' ? true : false;
  });

  // Tallennetaan localStorageen aina, kun tila muuttuu
  useEffect(() => {
    localStorage.setItem('productView', showByCategory ? 'showByCategory' : '');
  }, [showByCategory]);


  /* Koska fetchAndSetProductsAndCategories-funktiota käytetään useissa paikoissa, funktion määrittely 
  on hyvä olla useEffect-hookin ulkopuolelle. Varmistetaan kuitenkin, että se ei muutu jokaisella renderöinnillä. 
  Käytetään useCallback-hookia, joka palauttaa memoized version funktiosta, 
  joka  muuttuu vain, jos joku sen riippuvuuksista muuttuu.
  */

  const fetchAndSetProductsAndCategories = useCallback(async () => {
    try {
      const allProducts = await getProducts();
      const allCategories = await getCategories();
      setProducts(allProducts);
      setCategories(allCategories);

      // Expand only the selected category
      if (categoryId) {
        setExpandedCategories(new Set([parseInt(categoryId, 10)]));
        // Find and set the selected category name
        const selectedCategory = allCategories.find(category => category.id === parseInt(categoryId, 10));
        setSelectedCategoryName(selectedCategory ? selectedCategory.name : '');
      } else {
        setExpandedCategories(new Set(allCategories.map(category => category.id).concat('uncategorized')));
        setSelectedCategoryId(null); // Reset selectedCategoryId to null if no category is selected
        setSelectedCategoryName(''); // Reset the selected category name
      }
    } catch (err) {
      setError(err.message);
    }
  }, [categoryId]);


  useEffect(() => {
    fetchAndSetProductsAndCategories();
  }, [fetchAndSetProductsAndCategories, refresh]);

  const handleAddProduct = async () => {
    try {
      const addedProdId = await addProduct({ name: newProduct, categoryId: selectedCategoryId });
      setHandledProductId(addedProdId);
      setNewProduct('');
      fetchAndSetProductsAndCategories();
      setFilter(''); // Clear the filter after adding a new product
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    // Tyhjätään skrollauspiste, jos oli aiemmin lisätty tuote. 
    // Ei aseteta uutta skrollauspistettä editissä, koska on jo valmiiksi vieritetyssä kohdassa
    setHandledProductId(null);
    setEditingProduct(product);
  };

  const handleSaveProduct = async (id, updatedProduct) => {
    setEditingProductAmount(false);
    try {
      await updateProduct(id, updatedProduct);
      fetchAndSetProductsAndCategories();
      setEditingProduct(null);
      setEditingProductAmount(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchAndSetProductsAndCategories();
      setEditingProduct(null);
      setEditingProductAmount(false);
    } catch (err) {
      setError(err.message);
    }
  };


  const handleShowByCategory = () => {
    setShowByCategory(!showByCategory);
    setError(null);
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setError(null);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewProduct(value);
    setFilter(value.toLowerCase());
    scrollToFirstMatchingProduct(value.toLowerCase());
    setError(null);
  };


  const offset = 400;

  const scrollToFirstMatchingProduct = (filter) => {
    if (filter === '') return;

    const lowercasedFilter = filter.toLowerCase();
    const firstMatchingProduct = products.find((product) => product.name.toLowerCase().includes(lowercasedFilter));

    if (firstMatchingProduct && productRefs.current[firstMatchingProduct.id]) {
      const element = productRefs.current[firstMatchingProduct.id];
      const elementPosition = element.getBoundingClientRect().top;

      // Dynaaminen offset, koska näppäimistö vie tilaa. visualViewport ei sisällä on-screen näppäimistöä
      //const newOffset = window.visualViewport ? window.visualViewport.height / 2 : offset;
      //const offsetPosition = elementPosition + window.scrollY - newOffset; // ei toimi toivotusti 
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const product = await getProductById(id);
      product.isFavorite = !product.isFavorite;
      await updateProduct(id, product);
      const allProducts = await getProducts();
      setProducts(allProducts);
      scrollToFirstMatchingProduct(filter);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
    }
  };


  const timerRef = useRef(null);
  const handleShoppingListPress = (e, product) => {
    //e.preventDefault(); // 22.12.2024 kommentteihin, koska tuli virhe: Unable to preventDefault inside passive event listener invocation.
    //Mobiililaitteella seuraavan rivin teksti maalautui
    e.stopPropagation(); // Estetään tapahtuman leviäminen muihin elementteihin. 
    timerRef.current = setTimeout(() => {
      isShopLongPressRef.current = true;
    }, 500); // 500ms on aika, jota pidetään "pitkänä painalluksena"    
  }

  const handleShoppingListRelease = (e, product) => {

    e.preventDefault();
    //Mobiililaitteella seuraavan rivin teksti maalautui
    e.stopPropagation(); // Estetään tapahtuman leviäminen muihin elementteihin. 

    //openQuantityByLongPress -asetuksen ja klikkauksen pituuden mukaan joko avataan määrädialogi tai lisätään tuote suoraan ostoslistalle
    const shouldOpenQuantityDialog = openQuantityByLongPress
      ? isShopLongPressRef.current
      : !isShopLongPressRef.current && !product.onShoppingList;

    if (shouldOpenQuantityDialog) {
      product.onShoppingList = true;
      setEditingProduct(product);
      setEditingProductAmount(true);
    } else {
      handleToggleShoppingList(product.id);
    }

    // Tyhjennä pitkän painalluksen ajastin ja tilat
    clearTimeout(timerRef.current);
    isShopLongPressRef.current = false;
  }

  // 22.12.2024 Lisätään tapahtumankuuntelija passiiviseksi, koska tuli virhe: Unable to preventDefault inside passive event listener invocation.
  // Jätän tämn tähän muistutukseksi, rttä tämä esti koko näytön vierittämisen. Tekoäly tätä ehdotti jonkin virheen krjaamiseen, eipä ollut järkevä
  /*
  useEffect(() => {
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  */

  // Estä oletustoiminta touchmove- ja contextmenu-tapahtumissa
  const handleTouchMove = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleToggleShoppingList = async (id) => {

    try {
      const product = await getProductById(id);
      product.onShoppingList = !product.onShoppingList;
      await updateProduct(id, product);
      const allProducts = await getProducts();
      setProducts(allProducts);
      scrollToFirstMatchingProduct(filter);
    } catch (err) {
      console.error('Error toggling shopping list:', err);
      setError(err.message);
    }
  };



  // Group products by category and sort by order
  const groupedProducts = categories
    .sort((a, b) => a.order - b.order)
    .reduce((acc, category) => {
      const categoryProducts = products.filter(product => product.categoryId === category.id);
      if (categoryProducts.length > 0) {
        acc.push({
          id: category.id,
          name: `${category.name} (${categoryProducts.length})`,
          products: categoryProducts,
        });
      }
      return acc;
    }, []);

  // Lisätään ylimmäksi tuotteet, joilla ei ole kategoriaa.
  const uncategorizedProducts = products.filter(product => !product.categoryId || !categories.some(category => category.id === product.categoryId));
  if (uncategorizedProducts.length > 0) {
    groupedProducts.unshift({
      id: 'uncategorized',
      name: `Ei kategoriaa (${uncategorizedProducts.length})`,
      products: uncategorizedProducts,
    });
  }

  // TODO, debugatessa: Products.js:257 Warning: Cannot update during an existing state transition (such as within `render`). 
  // Render methods should be a pure function of props and state.
  const displayedProducts = (category) => {
    let filteredProducts = category.products;
    if (showFavorites) {
      filteredProducts = filteredProducts.filter(product => product.isFavorite);
    }

    // Suodata väreillä
    return colorFilteredProducts(filteredProducts);
  };

  const colorFilteredProducts = (products) => {
    let filteredProducts = products;

    if (selectedColors.length > 0 && colorCodingEnabled) {
      filteredProducts = filteredProducts.filter(product => {
        // Tarkista, onko tuote värikoodien joukossa tai onko se ilman värikoodia
        const hasSelectedColor = Object.keys(colors).some(colorKey =>
          product[colorKey] && selectedColors.includes(colorKey)
        );
        const noColorSelected = selectedColors.includes('noColor') && !Object.keys(colors).some(colorKey => product[colorKey]);

        return hasSelectedColor || noColorSelected;
      });
    }

    return filteredProducts;
  };


  const sortedProducts = () => {

    let sorted = [...products];
    if (showFavorites) {
      sorted = sorted.filter(product => product.isFavorite);
    }
    return sorted;
    // no need to sort here, sorted when fetched from db
    //return sorted.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleClearFilter = () => {
    setFilter('');
    setNewProduct('');
  };

  useEffect(() => {
    if (handledProductId && productRefs.current[handledProductId]) {
      const element = productRefs.current[handledProductId];
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset; // Adjust 100px for the top margin
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setHandledProductId(null);
    }
  }, [handledProductId, products]);


  const highlightText = (text, highlight) => {
    if (!highlight) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  const handleFilterClick = () => {
    if (selectedColors.length > 0) {
      setSelectedColors([]); // Tyhjentää värivalinnat
    }
  };


  const MyContainer = (props) => {
    return colorCodingEnabled ?
      <ProductContainer {...props} /> :
      <Container {...props} />;
  };

  const renderProductItemComponent = (product, index) => {
    return (
      <ProductItemComponent
        key={product.id}
        product={product}
        ref={(el) => (productRefs.current[product.id] = el)}
        highlightText={highlightText}
        filter={filter}
        handleEditProduct={handleEditProduct}
        handleToggleFavorite={handleToggleFavorite}
        handleShoppingListPress={handleShoppingListPress}
        handleShoppingListRelease={handleShoppingListRelease}
        handleTouchMove={handleTouchMove}
        handleContextMenu={handleContextMenu}
        colors={colors}
        selectedColors={selectedColors}        
      />
    );
  }

  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  // EditProductForm ei ole styled komponentti, ei käytetä transienttia propsia
  return (
    <>
      {error && (
        <Toast message={error} onClose={() => setError('')} />
      )}


      {(editingProduct) && (
        <EditProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => { setEditingProduct(null); setEditingProductAmount(false); }}
          onDelete={handleDeleteProduct}
          isOpen={editingProduct}
          editAmount={editingProductAmount}
        />
      )}

      <MyContainer $isEditFormOpen={editingProduct}>
        <ProductStickyTop $showFilterRow={colorCodingEnabled}>
          <div className='topHeader'>
            <b>{selectedCategoryName && `${selectedCategoryName}:`}Tuotteet</b>

            {!selectedCategoryId && (

              <div className="category-switch">
                <label>
                  Kategoriat
                </label>
                <SwitchButtonComponent
                  checked={showByCategory}
                  onChange={handleShowByCategory}
                />
              </div>

            )}
            <IconWrapper onClick={handleShowFavorites}>
              <FontAwesomeIcon
                icon={showFavorites ? faStarSolid : faStarRegular}
                style={{ color: showFavorites ? 'gold' : 'gray' }}
              />
            </IconWrapper>
          </div>

          {colorCodingEnabled && (
            <div className='filter-row'>

              <FilterWithCrossIcon className =  'FilterWithCrossIcon"'
                $filterEnabled={selectedColors.length > 0}
                onClick={handleFilterClick}
              />
              <ColorItemsWrapper className='CIWrapper'>
                {Object.keys(colors).map(colorKey => (
                  <ColorItemContainer key={colorKey} className='CIContainer'>
                    <ColorItemSelection 
                      className='CISelection'
                      color={colors[colorKey]}
                      selected={selectedColors.includes(colorKey)}
                      onClick={() => toggleColor(colorKey)}
                    > {colorDefinitions[colorKey]?.shortname || ''}
                    </ColorItemSelection>
                  </ColorItemContainer>
                ))}

                <ColorItemContainer className='CIContainer'>
                  <ColorItemSelection
                    className='CISelection'
                    color={noColor}
                    selected={selectedColors.includes('noColor')}
                    onClick={() => toggleColor('noColor')}
                  >Väritön
                  </ColorItemSelection>
                </ColorItemContainer>

              </ColorItemsWrapper>
            </div>
          )}

        </ProductStickyTop>

        {(showByCategory || selectedCategoryId !== null) ? (
          groupedProducts
            .filter(category => selectedCategoryId === null || category.id === selectedCategoryId)
            .map(category => (
              expandedCategories.has(category.id) && (
                <Accordion key={category.id} title={category.name} defaultExpanded={expandedCategories.has(category.id)}>
                  <div>
                    {displayedProducts(category).map((product, index) => (
                      renderProductItemComponent(product, index)
                    ))}

                  </div>

                </Accordion>
              )
            ))
        ) : (
          <div>
            {colorFilteredProducts(sortedProducts()).map((product, index) => (
              renderProductItemComponent(product, index)
            ))}

          </div>

        )}
      </MyContainer>
      <StickyBottom>

        <IconWrapper >
          {newProduct ? (
            <FontAwesomeIcon onClick={handleClearFilter}
              icon={faTimes}
            />
          ) : (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
            />
          )}
        </IconWrapper>

        <InputAdd
          type="text"
          value={newProduct}
          onChange={handleInputChange}
          placeholder="Etsi tai lisää tuote"
        />
        <AddButton onClick={handleAddProduct} />
      </StickyBottom>
    </>
  );
};

export default Products;