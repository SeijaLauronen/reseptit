import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditProductForm from './EditProductForm';
import { PrimaryButton } from './Button';
import { AddButton } from './Button';

const Container = styled.div`
  padding: 20px;
  opacity: ${({ isMenuOpen }) => (isMenuOpen ? 0.5 : 1)};
  pointer-events: ${({ isMenuOpen }) => (isMenuOpen ? 'none' : 'auto')};
  transition: opacity 0.3s ease-in-out;
`;

const ProductItem = styled.div`
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

const Products = ({ refresh = false, isMenuOpen }) => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const db = await getDB();
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const allProducts = await store.getAll();
      setProducts(allProducts.sort((a, b) => a.order - b.order));
    };

    fetchProducts();
  }, [refresh]);

  const handleAddProduct = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const newOrder = products.length ? Math.max(products.map(prod => prod.order)) + 1 : 1;
    await store.add({ name: newProduct, order: newOrder });
    setNewProduct('');
    const allProducts = await store.getAll();
    setProducts(allProducts.sort((a, b) => a.order - b.order));
  };

  const handleDeleteProduct = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.delete(id);
    const allProducts = await store.getAll();
    setProducts(allProducts.sort((a, b) => a.order - b.order));
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (id, updatedProduct) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.name = updatedProduct.name;
    await store.put(product);
    const allProducts = await store.getAll();
    setProducts(allProducts.sort((a, b) => a.order - b.order));
    setEditingProduct(null);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedProducts = Array.from(products);
    const [removed] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, removed);

    setProducts(reorderedProducts);

    // Save the reordered products to the database
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    for (let i = 0; i < reorderedProducts.length; i++) {
      const product = reorderedProducts[i];
      product.order = i;
      await store.put(product);
    }
  };

  return (
    <Container isMenuOpen={isMenuOpen}>
      <h1>Products</h1>
      {editingProduct ? (
        <EditProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <>
          <input
            type="text"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="New product name"
          />
          <AddButton onClick={handleAddProduct}/>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-products">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {products.map((product, index) => (
                    <Draggable key={product.id.toString()} draggableId={product.id.toString()} index={index}>
                      {(provided) => (
                        <ProductItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{product.name}</span>
                          <div>
                            <IconWrapper onClick={() => handleEditProduct(product)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </IconWrapper>
                          </div>
                        </ProductItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
    </Container>
  );
};

export default Products;
