import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Accordion from '../components/Accordion';
import StickyBottom from '../components/StickyBottom';
import StickyTop from '../components/StickyTop';
import { OkButton, PrimaryButton, CloseButtonComponent, CopyButton, ShareButton, ImportButton } from '../components/Button'; 
import { ShoppingListItem } from '../components/Item';
import Container, { SlideInContainerRight, ButtonGroup, FormContainer } from '../components/Container';
import { InputWrapper, GroupLeft, GroupRight } from '../components/Container';
import { InputQuantity, InputUnit } from '../components/Input';
import { getProducts, getProductById, getCategories, updateProduct, updateProducts, getProductsOnShoppingList, updateProductField, addCategory, addProduct } from '../controller';
import Info from '../components/Info';
import Toast from '../components/Toast'; 
import DisabledOverlay from '../components/DisabledOverlay';

const ShoppingList = ({ refresh = false, isMenuOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [error, setError] = useState('');
  const [shoppingListText, setShoppingListText] = useState('');
  const [importText, setImportText] = useState('');

  const handleOpenInfo = (message) => {
    if (message === 'print') {
      const listText = buildShoppingListText();
      setShoppingListText(listText);        
    } 
    setInfoMessage(message);
    setIsInfoOpen(true);
  };
  
  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const handleOpenPrint = () => {    
    const listText = buildShoppingListText();
    setShoppingListText(listText);            
    setIsPrintOpen(true);
  };
  
  const handleClosePrint = () => {
    setIsPrintOpen(false);
  };

  const handleOpenImport = () => {
    setIsImportOpen(true);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false);
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
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { 
    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (isPrintOpen) {
      const listText = buildShoppingListText();
      setShoppingListText(listText);
    }
  }, [isPrintOpen, products, selectedProducts]);

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
      fetchData();
    } catch (err) {
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

  // Lisätään tuotteet, joilla ei ole kategoriaa tai kategoriaId ei löydy kategorioista.
  const uncategorizedProducts = products.filter(product => !product.categoryId || !categories.some(category => category.id === product.categoryId));
  if (uncategorizedProducts.length > 0) {
    groupedProducts.unshift({
      id: 'uncategorized',
      name: `Ei kategoriaa (${uncategorizedProducts.length})`,
      products: uncategorizedProducts,
    });
  }

  const buildShoppingListText = () => {
    let listText = '';
    groupedProducts.forEach(category => {
      listText += `${category.name}:\n`;
      category.products.forEach(product => {
        const prefix = selectedProducts.has(product.id) ? '*' : '-';
        listText += `${prefix} ${product.name} ${product.quantity || ''} ${product.unit || ''}\n`;
      });
      listText += '\n';
    });
    return listText;
  };

  const handleTextAreaChange = (event) => {
    setShoppingListText(event.target.value);
  };

  const handleImportTextAreaChange = (event) => {
    setImportText(event.target.value);
  };

  const handleCopy = (event) => {
    navigator.clipboard.writeText(shoppingListText);
    resetButtonState(event); // Button väri normaaliksi klikkauksen jälkeen
  };

  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: 'Ostoslista',
        text: shoppingListText,
      });
    } else {      
      handleOpenInfo('Jakaminen ei ole tuettu tässä selaimessa.');
    }
    resetButtonState(event); // Button väri normaaliksi klikkauksen jälkeen
  };

  //TODO yritetään palauttaa painikkeiden väri klikkauksen jälkeen, ei toimi
  const resetButtonState = (event) => {
    const button = event.currentTarget;
    button.blur();
  };

  //TODO tästä tulee vielä uutta lisättäessä Warning: Each child in a list should have a unique "key" prop.
  const handleImport = async () => {
    const lines = importText.split('\n');
    let currentCategory = null;

    for (const line of lines) {
      if (line.trim() === '') continue;

      const categoryMatch = line.match(/^(.+) \(\d+\):$/);
      if (categoryMatch) {
        const categoryName = categoryMatch[1];
        if (categoryName === "Ei kategoriaa") {
          currentCategory = null;
        } else {
          let category = categories.find(cat => cat.name === categoryName);
          if (!category) {
            const categoryId = await addCategory({ name: categoryName });
            category = { id: categoryId, name: categoryName };
            setCategories(prevCategories => [...prevCategories, category]);
          }
          currentCategory = category;
        }
      } else if (currentCategory || (line.startsWith('-') || line.startsWith('*'))) {
        //TODO tämä muuten kuin regexillä?
        //const itemMatch = line.match(/^([\*\-])(.+?)(?:\s+(\d+)(?:\s+(\w+))?)?$/);//Muuten ok, mutta lopussa tyhjiäUnnecessary escape character: \* Unnecessary escape character: \-
        //const itemMatch = line.match(/^([\*\-])\s*(.+?)(?:\s+(\d+))?(?:\s+(\w+))?$/);//Luulin että ääkkösongelma, tämän piti ratkaista...
        const itemMatch = line.match(/^([\*\-])\s*(.+?)(?:\s+(\d+))?(?:\s+(\w+))?\s*$/); //lopusta tyhjät pois
        if (itemMatch) {
          const [, prefix, name, quantity, unit] = itemMatch;
          const categoryId = currentCategory ? currentCategory.id : null;
          const trimmedName = name.trim();
          
          let product = products.find(prod => prod.name === trimmedName && prod.categoryId === categoryId);
          if (!product) {
            product = await addProduct({
              name: trimmedName,
              categoryId: categoryId,
              quantity: quantity || null,
              unit: unit || null,
              onShoppingList: true,
              selected: prefix === '*',
            });
            setProducts(prevProducts => [...prevProducts, product]);
          } else {
            await updateProduct(product.id, {
              ...product,
              quantity: quantity || product.quantity,
              unit: unit || product.unit,
              onShoppingList: true,
              selected: prefix === '*',
            });
          }
        }
      }
    }

    setImportText('');
    handleCloseImport();
    fetchData();
  };

// transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (
    <>
    { error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      <DisabledOverlay $isDisabled={isPrintOpen || isImportOpen}>
      <Container $isMenuOpen={isMenuOpen} $isPrintOpen={isPrintOpen}>
         <StickyTop> 
            <b>Ostoslista</b>
         </StickyTop> 
        {groupedProducts.map(category => (
          <Accordion key={category.id} title={category.name} defaultExpanded={true}>
            {category.products.map(product => (
              <ShoppingListItem key={product.id}>
                <input
                  disabled={isPrintOpen}
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleToggleSelect(product.id)}
                />
                <span>{product.name}</span>
                <InputWrapper>
                  <InputQuantity
                    disabled={isPrintOpen}
                    type="number"
                    value={product.quantity || ''}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    placeholder="Määrä"
                  />
                  <InputUnit
                    disabled={isPrintOpen}
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
        <DisabledOverlay $isDisabled={isPrintOpen}>
          <StickyBottom>
            <GroupLeft>
              <OkButton
                disabled={selectedProducts.size === 0 }
                onClick={handleRemoveSelected}
              >
                Poista valitut
              </OkButton>
            </GroupLeft>
            <GroupRight>   
              <PrimaryButton onClick={handleOpenImport}>Tuo lista</PrimaryButton>             
              <ShareButton onClick={handleOpenPrint}>Jaa lista</ShareButton>                                      
            </GroupRight>
          </StickyBottom>
        </DisabledOverlay>
      </Container>
      </DisabledOverlay>

      <SlideInContainerRight $isOpen={isPrintOpen}>
      <CloseButtonComponent onClick={handleClosePrint}></CloseButtonComponent>
        <FormContainer>      
          <textarea       
            value={shoppingListText}
            onChange={handleTextAreaChange}
            rows="20"
            cols="40"
          />
          <ButtonGroup>
            <GroupLeft>
              <CopyButton onClick={(event) => handleCopy(event)}>Kopioi leikepöydälle</CopyButton>                    
              <ShareButton onClick={(event) => handleShare(event)}>Jaa lista</ShareButton>   
            </GroupLeft>
          </ButtonGroup>
        </FormContainer>
      </SlideInContainerRight>
      
      <SlideInContainerRight $isOpen={isImportOpen}>
        <CloseButtonComponent onClick={handleCloseImport}></CloseButtonComponent>
        <FormContainer>      
          <textarea       
            value={importText}
            onChange={handleImportTextAreaChange}
            rows="20"
            cols="40"
            placeholder="Liitä ostoslista tähän..."
          />
          <ButtonGroup>
            <GroupLeft>
              <PrimaryButton onClick={handleImport}>Tuo lista</PrimaryButton>
            </GroupLeft>
          </ButtonGroup>
        </FormContainer>
      </SlideInContainerRight>
      {isInfoOpen} {
        <Info isOpen={isInfoOpen} onCancel={handleCloseInfo} >
          {infoMessage}
        </Info>
      }
    </>
  );
};

export default ShoppingList;
