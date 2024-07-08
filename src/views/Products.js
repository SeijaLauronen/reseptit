import React, { useState, useEffect, useRef } from 'react';
import { getDB } from '../database';
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
import { getProducts, getCategories, addProduct,  updateProduct, deleteProduct } from '../controller';
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

  const fetchAndSetProductsAndCategories = async () => {
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
  };

  useEffect(() => {
    fetchAndSetProductsAndCategories();
  }, [refresh, categoryId]);

  const handleAddProduct = async () => {
    try {
      const addedProdId = await addProduct({ name: newProduct, categoryId: selectedCategoryId });
      setHandledProductId(addedProdId);
      setNewProduct('');
      fetchAndSetProductsAndCategories();
      setFilter(''); // Clear the filter after adding a new product
      filterProducts(''); // Reset the filter
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (id, updatedProduct) => {
    try {
      await updateProduct (id, updatedProduct);
      fetchAndSetProductsAndCategories();
      setEditingProduct(null);
      filterProducts(filter); // Reapply the filter after saving a product
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
    fetchAndSetProductsAndCategories();
    setEditingProduct(null);
    filterProducts(filter); // Reapply the filter after deleting a product
  };

  //TODO tämä ei vielä tallenna
  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedProducts = Array.from(products);
    const [removed] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, removed);
    setProducts(reorderedProducts);

    // Save the reordered products to the database if needed
  };

  const handleShowByCategory = () => {
    setShowByCategory(!showByCategory);
    setError(null);
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setError(null);
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewProduct(value);
    setFilter(value.toLowerCase());
    filterProducts(value);
    setError(null);
  };

  const filterProducts = (filter) => {
    if (filter === '') {
      setExpandedCategories(new Set(categories.map(category => category.id).concat('uncategorized')));

      // Expand only the selected category
      if (selectedCategoryId) {
        setExpandedCategories(new Set([parseInt(selectedCategoryId, 10)]));
      } else {
        setExpandedCategories(new Set(categories.map(category => category.id).concat('uncategorized')));
      }
      return;
    }

    const lowercasedFilter = filter.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedFilter)
    );

    //Lisätty vielä rajaus jos on  selectedCategoryId
    const filteredCategories = categories.reduce((acc, category) => {
      const categoryProducts = filteredProducts.filter((product) => product.categoryId === category.id);
      if (categoryProducts.length > 0 && (selectedCategoryId === null || category.id === selectedCategoryId)) {
        acc.push(category.id);
      } else if (categoryProducts.length === 0 && category.id === selectedCategoryId) {
        acc.push(category.id);
      }

      return acc;
    }, []);

    const uncategorizedProducts = filteredProducts.filter((product) => !product.categoryId);
    if (uncategorizedProducts.length > 0 && selectedCategoryId === null) {
      filteredCategories.unshift('uncategorized');
    }

    setExpandedCategories(new Set(filteredCategories));
  };

  const handleToggleFavorite = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.isFavorite = !product.isFavorite;
    await store.put(product);
    const allProducts = await store.getAll();
    setProducts(allProducts);
    filterProducts(filter); // Reapply the filter after toggling favorite
  };

  const handleToggleShoppingList = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.onShoppingList = !product.onShoppingList;
    await store.put(product);
    const allProducts = await store.getAll();
    setProducts(allProducts);
    filterProducts(filter); // Reapply the filter after toggling shopping list
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
    if (filter !== '') {
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(filter));
    }
    return filteredProducts;
  };

  const sortedProducts = () => {
    let sorted = [...products];
    if (showFavorites) {
      sorted = sorted.filter(product => product.isFavorite);
    }
    if (filter !== '') {
      sorted = sorted.filter(product => product.name.toLowerCase().includes(filter));
    }
    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  };


  const handleClearFilter = () => {
    setFilter('');
    setNewProduct('');
    filterProducts('');
  }


  // Add an effect to scroll to the top when the filter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filter]);

  const offset = 100; 

  useEffect(() => {
    if (handledProductId && productRefs.current[handledProductId]) {
      const element = productRefs.current[handledProductId];
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset; // Adjust 100px for the top margin
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }, [handledProductId, products]);


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
          <h1/>     
          
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
                                  <span>{product.name}</span>
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
                          <span>{product.name}</span>
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
          placeholder="Suodata tai lisää tuote"
        />
        <AddButton onClick={handleAddProduct} />
      </StickyBottom>
    </>
  );
};

export default Products;
