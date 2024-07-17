import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faShoppingCart, faStar as faStarSolid, faTimes, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import EditProductForm from './forms/EditProductForm';
import Accordion from '../components/Accordion';
import StickyTop from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import Container, { IconContainer, IconWrapper } from '../components/Container';
import { ProductItem } from '../components/Item';
import { getCategories,getProducts, getProductById, addProduct,  updateProduct, deleteProduct } from '../controller';
import Toast from '../components/Toast'; 

const Products = ({ refresh = false, categoryId }) => {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [filter, setFilter] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId); //Lisäsin tämän
  const [selectedCategoryName, setSelectedCategoryName] = useState(''); //tämä lisätty
  const [showByCategory, setShowByCategory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState('');
  const [handledProductId, setHandledProductId] = useState(null); // ID of the newly added or edited product

  const productRefs = useRef({}); // Ref object to hold references to product items

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
        setShowByCategory(true); // Set showByCategory to true if a category is selected
        // Find and set the selected category name
        const selectedCategory = allCategories.find(category => category.id === parseInt(categoryId, 10));
        setSelectedCategoryName(selectedCategory ? selectedCategory.name : '');
      } else {
        setExpandedCategories(new Set(allCategories.map(category => category.id).concat('uncategorized')));
        setShowByCategory(false); // Reset showByCategory to false if no category is selected
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
    try {
      await updateProduct(id, updatedProduct);
      fetchAndSetProductsAndCategories();
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      fetchAndSetProductsAndCategories();
      setEditingProduct(null);
    }  catch (err) {
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
      const newOffset = window.visualViewport ? window.visualViewport.height / 2 : offset; 
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

  // Add products with no category under 'Uncategorized' at the top
  const uncategorizedProducts = products.filter(product => !product.categoryId);
  if (uncategorizedProducts.length > 0) {
    groupedProducts.unshift({
      id: 'uncategorized',
      name: `Ei kategoriaa (${uncategorizedProducts.length})`,
      products: uncategorizedProducts,
    });
  }

  const displayedProducts = (category) => {
    let filteredProducts = category.products;
    if (showFavorites) {
      filteredProducts = filteredProducts.filter(product => product.isFavorite);
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

  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  // EditProductForm ei ole styled komponentti, ei käytetä transienttia propsia
  return (
    <>
      { error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
          onDelete={handleDeleteProduct}
          isOpen={editingProduct}
        />
      )}
      <Container $isEditFormOpen={editingProduct}>
        <StickyTop>
            <b>{selectedCategoryName && `${selectedCategoryName}:`}Tuotteet</b>
            <div>
            {!selectedCategoryId && (
              <label>
                <input
                  type="checkbox"
                  checked={showByCategory}
                  onChange={handleShowByCategory}
                />
                Kategorioittain
              </label>              
            )}
              <IconWrapper onClick={handleShowFavorites}>
              <FontAwesomeIcon 
                icon={showFavorites ? faStarSolid : faStarRegular} 
                style={{ color: showFavorites ? 'gold' : 'gray' }} 
              />
              </IconWrapper>
            </div>            
          </StickyTop>                
          
          {showByCategory ? (
            groupedProducts              
              .filter(category => selectedCategoryId === null || category.id === selectedCategoryId)
              .map(category => (
                expandedCategories.has(category.id) && (
                  <Accordion key={category.id} title={category.name} defaultExpanded={expandedCategories.has(category.id)}>                    
                        <div>
                          {displayedProducts(category).map((product, index) => (                                                          
                                <ProductItem 
                                  key={product.id}                                
                                  ref={(el) => productRefs.current[product.id] = el}                                 
                                >
                                  <span>{highlightText(product.name, filter)}</span>
                                  <div>
                                    <IconContainer>
                                      <IconWrapper onClick={() => handleEditProduct(product)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                      </IconWrapper>
                                      <IconWrapper onClick={() => handleToggleFavorite(product.id)}>
                                        <FontAwesomeIcon
                                          icon={product.isFavorite ? faStarSolid : faStarRegular}
                                          style={{ color: product.isFavorite ? 'gold' : 'gray' }}
                                        />
                                      </IconWrapper>
                                      <IconWrapper onClick={() => handleToggleShoppingList(product.id)}>
                                        <FontAwesomeIcon
                                          icon={faShoppingCart}
                                          style={{ color: product.onShoppingList ? 'green' : 'lightgrey' }}
                                        />
                                      </IconWrapper>
                                    </IconContainer>
                                  </div>
                                </ProductItem>
                             
                          ))}
                          
                        </div>
                      
                  </Accordion>
                )
              ))
          ) : (                          
                <div>
                  {sortedProducts().map((product, index) => (                    
                        <ProductItem 
                          key={product.id}                           
                          ref={(el) => productRefs.current[product.id] = el}                          
                        >
                          <span>{highlightText(product.name, filter)}</span>
                          <div>
                            <IconContainer>
                              <IconWrapper onClick={() => handleEditProduct(product)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </IconWrapper>
                              <IconWrapper onClick={() => handleToggleFavorite(product.id)}>
                                <FontAwesomeIcon
                                  icon={product.isFavorite ? faStarSolid : faStarRegular}
                                  style={{ color: product.isFavorite ? 'gold' : 'gray' }}
                                />
                              </IconWrapper>
                              <IconWrapper onClick={() => handleToggleShoppingList(product.id)}>
                                <FontAwesomeIcon
                                  icon={faShoppingCart}
                                  style={{ color: product.onShoppingList ? 'green' : 'lightgrey' }}
                                />
                              </IconWrapper>
                            </IconContainer>
                          </div>
                        </ProductItem>                      
                  ))}                  
                </div>                          
          )}        
      </Container>
      <StickyBottom>
                
        <IconWrapper >
          {newProduct ? (
          <FontAwesomeIcon onClick={handleClearFilter}
          icon={faTimes}
          />
          ) : (
          <FontAwesomeIcon 
          icon={faMagnifyingGlass } 
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