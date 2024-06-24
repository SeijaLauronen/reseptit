import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  padding: 20px;
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

const IconWrapper = styled.span`
  margin-left: 10px;
  cursor: pointer;
`;

const ShoppingList = ({ refresh = false }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const db = await getDB();
      const productTx = db.transaction('products', 'readonly');
      const productStore = productTx.objectStore('products');
      const allProducts = await productStore.getAll();

      const shoppingListProducts = allProducts.filter(product => product.onShoppingList);
      setProducts(shoppingListProducts);
    };

    fetchData();
  }, [refresh]);

  const handleToggleSelect = (id) => {
    setSelectedProducts(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRemoveSelected = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    for (let id of selectedProducts) {
      const product = await store.get(id);
      product.onShoppingList = false;
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

  return (
    <Container>
      <h1>Shopping List</h1>
      {products.map(product => (
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
      {selectedProducts.size > 0 && (
        <button onClick={handleRemoveSelected}>
          <FontAwesomeIcon icon={faTrash} /> Remove Selected
        </button>
      )}
    </Container>
  );
};

export default ShoppingList;
