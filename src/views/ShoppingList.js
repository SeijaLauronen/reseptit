import React, { useState, useEffect } from 'react';
import Accordion from '../components/Accordion';
import StickyBottom from '../components/StickyBottom';
import StickyTop from '../components/StickyTop';
import { OkButton, PrimaryButton } from '../components/Button'; 
import { ShoppingListItem } from '../components/Item';
import Container from '../components/Container';
import { InputWrapper, GroupLeft, GroupRight } from '../components/Container';
import { InputQuantity, InputUnit } from '../components/Input';
import { getProducts, getProductById, getCategories,  updateProduct, updateProducts, getProductsOnShoppingList, updateProductField } from '../controller';
import Info from '../components/Info';
import Toast from '../components/Toast'; 

const ShoppingList = ({ refresh = false, isMenuOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [error, setError] = useState('');

  const handleOpenInfo = (message) => {
    setInfoMessage(message);
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const fetchData = async () => {
    try {        
      const allProducts = await getProducts();
      const allCategories = await getCategories();

      const shoppingListProducts = allProducts.filter(product => product.onShoppingList);     
      setProducts(shoppingListProducts);
      setCategories(allCategories);

      const selected = new Set(shoppingListProducts.filter(product => product.selected).map(product => product.id));
      setSelectedProducts(selected);
      }  catch (err) {
        setError(err.message);
      }
  };

  useEffect(() => { 
    fetchData();
  }, [refresh]);


  const handleToggleSelect = async (id) => {
    try {
      /* Kopioidaan nykyinen tila newSet:iin, johon muutokset ja jolla korvataan selectedProducts  */
      setSelectedProducts(prevState => {
        const newSet = new Set(prevState);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });

      const product = await getProductById(id);
      product.selected = !product.selected;
      await updateProduct(id, product);  
    }
    catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      // Hae kaikki valitut tuotteet id:n perusteella
      const selectedProductIds = Array.from(selectedProducts);
      const selectedProductsArray = await Promise.all(selectedProductIds.map(id => getProductById(id)));
  
      // Päivitä valitut tuotteet 
      // Luo uuden olion, joka sisältää kaikki alkuperäisen product-olion kentät ja niiden arvot, jonne päivitetään uudet arvot
      const updatedProducts = selectedProductsArray.map(product => ({
        ...product,
        onShoppingList: false,
        selected: false
      }));
  
      await updateProducts(updatedProducts);
  
      // Hae päivitetyt tuotteet ostoslistalta ja aseta tilaan
      const shoppingListProducts = await getProductsOnShoppingList();
      setProducts(shoppingListProducts);
  
      // Tyhjennä valitut tuotteet
      setSelectedProducts(new Set());
    } catch (err) {      
      setError(err.message);
    }
  };

  const handleFieldChange = async (id, field, value) => {
    try {
      await updateProductField(id, field, value);
      // Hae päivitetyt tuotteet ostoslistalta ja aseta tilaan
      const shoppingListProducts = await getProductsOnShoppingList();
      setProducts(shoppingListProducts);
    } catch (err) {      
      setError(err.message);
    }
  };

  const handleQuantityChange = (id, quantity) => handleFieldChange(id, 'quantity', quantity);
  const handleUnitChange = (id, unit) => handleFieldChange(id, 'unit', unit);



  const groupedProducts = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(product => product.categoryId == category.id); //Tarkoituksella == eikä ===
    if (categoryProducts.length > 0) {
      acc.push({
        id: category.id,
        name: `${category.name} (${categoryProducts.length})`,
        products: categoryProducts,
      });
    }
    return acc;
  }, []);

  // Add products with no category under 'Uncategorized'
  const uncategorizedProducts = products.filter(product => !product.categoryId);
  if (uncategorizedProducts.length > 0) {
    groupedProducts.unshift({
      id: 'uncategorized',
      name: `Ei kategoriaa (${uncategorizedProducts.length})`,
      products: uncategorizedProducts,
    });
  }

  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (
    <>
    { error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      <Container $isMenuOpen={isMenuOpen}>
         <StickyTop> 
            <b>Ostoslista</b>
         </StickyTop> 
        {groupedProducts.map(category => (
          <Accordion key={category.id} title={category.name} defaultExpanded={true}>
            {category.products.map(product => (
              <ShoppingListItem key={product.id}>
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleToggleSelect(product.id)}
                />
                <span>{product.name}</span>
                <InputWrapper>
                  <InputQuantity
                    type="number"
                    value={product.quantity || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    placeholder="Määrä"
                  />
                  <InputUnit
                    type="text"
                    value={product.unit || ''}
                    onChange={(e) => handleUnitChange(product.id, e.target.value)}
                    placeholder="Yksikkö"
                  />
                </InputWrapper>
              </ShoppingListItem>
            ))}
          </Accordion>
        ))}
        <StickyBottom>
          <GroupLeft>
            <OkButton
              disabled={selectedProducts.size === 0}
              onClick={handleRemoveSelected}
            >
              Poista valitut listalta
            </OkButton>
          </GroupLeft>
          <GroupRight>
            <PrimaryButton onClick ={() => handleOpenInfo('Tulostusta ei ole vielä toteutettu.')}>Tulosta lista</PrimaryButton>                          
          </GroupRight>
        </StickyBottom>
      </Container>
      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>
 
    </>
  );
};

export default ShoppingList;
