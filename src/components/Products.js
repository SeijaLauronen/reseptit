import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import EditProductForm from './EditProductForm';
import Accordion from './Accordion';

const Container = styled.div`
  padding: 20px;
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

const Products = ({ refresh = false }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const db = await getDB();
      const productTx = db.transaction('products', 'readonly');
      const productStore = productTx.objectStore('products');
      const allProducts = await productStore.getAll();

      const categoryTx = db.transaction('categories', 'readonly');
      const categoryStore = categoryTx.objectStore('categories');
      const allCategories = await categoryStore.getAll();

      setProducts(allProducts);
      setCategories(allCategories);
      setExpandedCategories(new Set(allCategories.map(category => category.id).concat('uncategorized')));
    };

    fetchData();
  }, [refresh]);

  const handleAddProduct = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.add({ name: newProduct });
    setNewProduct('');
    const allProducts = await store.getAll();
    setProducts(allProducts);
    setFilter(''); // Clear the filter after adding a new product
    filterProducts(''); // Reset the filter
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
    product.categoryId = parseInt(updatedProduct.categoryId, 10);
    await store.put(product);
    const allProducts = await store.getAll();
    setProducts(allProducts);
    setEditingProduct(null);
    filterProducts(filter); // Reapply the filter after saving a product
  };

  const handleDeleteProduct = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.delete(id);
    const allProducts = await store.getAll();
    setProducts(allProducts);
    setEditingProduct(null);
    filterProducts(filter); // Reapply the filter after deleting a product
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedProducts = Array.from(products);
    const [removed] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, removed);
    setProducts(reorderedProducts);

    // Save the reordered products to the database if needed
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewProduct(value);
    setFilter(value.toLowerCase());
    filterProducts(value);
  };

  const filterProducts = (filter) => {
    if (filter === '') {
      setExpandedCategories(new Set(categories.map(category => category.id).concat('uncategorized')));
      return;
    }

    const lowercasedFilter = filter.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedFilter)
    );

    const filteredCategories = categories.reduce((acc, category) => {
      const categoryProducts = filteredProducts.filter((product) => product.categoryId === category.id);
      if (categoryProducts.length > 0) {
        acc.push(category.id);
      }
      return acc;
    }, []);

    const uncategorizedProducts = filteredProducts.filter((product) => !product.categoryId);
    if (uncategorizedProducts.length > 0) {
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
      name: `Uncategorized (${uncategorizedProducts.length})`,
      products: uncategorizedProducts,
    });
  }

  const displayedProducts = (category) => {
    if (filter === '') {
      return category.products;
    }
    return category.products.filter(product => product.name.toLowerCase().includes(filter));
  };

  return (
    <Container>
      <h1>Products</h1>
      {editingProduct ? (
        <EditProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => setEditingProduct(null)}
          onDelete={handleDeleteProduct}
          isOpen={!!editingProduct}
        />
      ) : (
        <>
          <input
            type="text"
            value={newProduct}
            onChange={handleInputChange}
            placeholder="New product name"
          />
          <button onClick={handleAddProduct}>Add</button>
          <DragDropContext onDragEnd={handleDragEnd}>
            {groupedProducts.map(category => (
              expandedCategories.has(category.id) && (
                <Accordion key={category.id} title={category.name} defaultExpanded={expandedCategories.has(category.id)}>
                  <Droppable droppableId={`droppable-${category.id}`}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {displayedProducts(category).map((product, index) => (
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
                                  <IconWrapper onClick={() => handleToggleFavorite(product.id)}>
                                    <FontAwesomeIcon icon={faStar} style={{ color: product.isFavorite ? 'gold' : 'gray' }} />
                                  </IconWrapper>
                                  <IconWrapper onClick={() => handleToggleShoppingList(product.id)}>
                                    <FontAwesomeIcon icon={faShoppingCart} style={{ color: product.onShoppingList ? 'green' : 'gray' }} />
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
                </Accordion>
              )
            ))}
          </DragDropContext>
        </>
      )}
    </Container>
  );
};

export default Products;
