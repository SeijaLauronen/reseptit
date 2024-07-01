import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Accordion from './Accordion';
import { DeleteButton } from './Button'; // Import DeleteButton
import { PrimaryButton } from './Button';

const Container = styled.div`
  padding: 20px;
  opacity: ${({ isMenuOpen }) => (isMenuOpen ? 0.5 : 1)};
  pointer-events: ${({ isMenuOpen }) => (isMenuOpen ? 'none' : 'auto')};
  transition: opacity 0.3s ease-in-out;
`;

const ShoppingListItem = styled.div`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* Warnig:  never used */
const IconWrapper = styled.span`
  margin-left: 10px;
  cursor: pointer;
`;

const ButtonContainerXYZ = styled.div`
  position: fixed;
  bottom: 60px; /* Adjusted to be above the footer */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  width: 90%; /* Adjust as needed */
  z-index: 1000;
  background-color: #f8f8f8; /* Ensure background is not transparent */
  padding: 10px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1); /* Add some shadow for better visibility */
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  width: 90%;
  z-index: 1000;
  background-color: #f8f8f8;
  padding: 10px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonGroupLeft = styled.div`
  display: flex;
`;

const ButtonGroupRight = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* Optional: adds space between buttons */
  flex: 1;
`;




const ShoppingList = ({ refresh = false, isMenuOpen }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const db = await getDB();
      const productTx = db.transaction('products', 'readonly');
      const productStore = productTx.objectStore('products');
      const allProducts = await productStore.getAll();

      const categoryTx = db.transaction('categories', 'readonly');
      const categoryStore = categoryTx.objectStore('categories');
      const allCategories = await categoryStore.getAll();

      const shoppingListProducts = allProducts.filter(product => product.onShoppingList);

      // Sort categories based on the "order" value
      const sortedCategories = allCategories.sort((a, b) => a.order - b.order);

      setProducts(shoppingListProducts);
      setCategories(sortedCategories);

      const selected = new Set(shoppingListProducts.filter(product => product.selected).map(product => product.id));
      setSelectedProducts(selected);
    };

    fetchData();
  }, [refresh]);

  const handleToggleSelect = async (id) => {
    setSelectedProducts(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.selected = !product.selected;
    await store.put(product);
  };

  const handleRemoveSelected = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    for (let id of selectedProducts) {
      const product = await store.get(id);
      product.onShoppingList = false;
      product.selected = false;  // Also unselect the product when removing from the shopping list
      await store.put(product);
    }

    const allProducts = await store.getAll();
    const shoppingListProducts = allProducts.filter(product => product.onShoppingList);
    setProducts(shoppingListProducts);
    setSelectedProducts(new Set());
  };

  const handleQuantityChange = async (id, quantity) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.quantity = quantity;
    await store.put(product);

    const allProducts = await store.getAll();
    const shoppingListProducts = allProducts.filter(product => product.onShoppingList);
    setProducts(shoppingListProducts);
  };

  const handleUnitChange = async (id, unit) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.unit = unit;
    await store.put(product);

    const allProducts = await store.getAll();
    const shoppingListProducts = allProducts.filter(product => product.onShoppingList);
    setProducts(shoppingListProducts);
  };

  const groupedProducts = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(product => product.categoryId == category.id);
    if (categoryProducts.length > 0) {
      acc.push({
        id: category.id,
        name: category.name,
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
      name: 'Uncategorized',
      products: uncategorizedProducts,
    });
  }

  return (
    <Container isMenuOpen={isMenuOpen}>
      <h1>Shopping List</h1>
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
              <input
                type="number"
                value={product.quantity || ''}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                placeholder="Quantity"
              />
              <input
                type="text"
                value={product.unit || ''}
                onChange={(e) => handleUnitChange(product.id, e.target.value)}
                placeholder="Unit"
              />
            </ShoppingListItem>
          ))}
        </Accordion>
      ))}
      <ButtonContainer>
        <ButtonGroupLeft>
          <DeleteButton
            disabled={selectedProducts.size === 0}
            onClick={handleRemoveSelected}
          >
            Poista valitut listalta
          </DeleteButton>
        </ButtonGroupLeft>
        <ButtonGroupRight>
          <PrimaryButton disabled>Button 1</PrimaryButton>
          <PrimaryButton disabled>Button 2</PrimaryButton>
        </ButtonGroupRight>
      </ButtonContainer>
    </Container>
  );
};

export default ShoppingList;
