import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';

const Container = styled.div`
  padding: 20px;
`;

const ProductList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProductItem = styled.li`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  margin-right: 10px;
`;

const Button = styled.button`
  margin-left: 10px;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      const db = await getDB();
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const allProducts = await store.getAll();
      setProducts(allProducts);
    };

    fetchProducts();
  }, []);

  const addProduct = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.add({ name: newProduct });
    const allProducts = await store.getAll();
    setProducts(allProducts);
    setNewProduct('');
  };

  return (
    <Container>
      <h1>Tuotteet</h1>
      <Input
        type="text"
        value={newProduct}
        onChange={e => setNewProduct(e.target.value)}
      />
      <Button onClick={addProduct}>Add</Button>
      <ProductList>
        {products.map(product => (
          <ProductItem key={product.id}>
            <Input type="text" value={product.name} readOnly />
            {/* Lisää ikoneita tai muita toimintoja */}
          </ProductItem>
        ))}
      </ProductList>
    </Container>
  );
};

export default Products;
