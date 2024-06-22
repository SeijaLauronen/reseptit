import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProductsContainer = styled.div`
  padding: 20px;
`;

const ProductItem = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  padding: 5px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
`;

const Products = ({ refresh }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewByCategory, setViewByCategory] = useState(true);

  const fetchProducts = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    const allProducts = await store.getAll();
    setProducts(allProducts);
  };

  const fetchCategories = async () => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    const allCategories = await store.getAll();
    setCategories(allCategories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [refresh]); // Päivitetään, kun refresh muuttuu

  const addProduct = async () => {
    if (newProduct.trim() === "") return;
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.add({ name: newProduct, categoryId: selectedCategory || 1 });
    setNewProduct("");
    fetchProducts();
  };

  const updateProduct = async (id, newName, newCategoryId) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.name = newName;
    product.categoryId = newCategoryId;
    await store.put(product);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.delete(id);
    fetchProducts();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setProducts(items);

    // Päivitä järjestys tietokantaan, jos haluat tallentaa uuden järjestyksen
  };

  return (
    <ProductsContainer>
      <div>
        <Input
          type="text"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          placeholder="New Product"
        />
        <Button onClick={addProduct}>Add</Button>
        <Button onClick={() => setViewByCategory(!viewByCategory)}>
          {viewByCategory ? "View Alphabetically" : "View By Category"}
        </Button>
      </div>
      {viewByCategory ? (
        <div>
          {categories.map(category => (
            <div key={category.id}>
              <h3>{category.name} ({products.filter(product => product.categoryId === category.id).length})</h3>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`category-${category.id}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {products.filter(product => product.categoryId === category.id).map((product, index) => (
                        <Draggable key={product.id} draggableId={String(product.id)} index={index}>
                          {(provided) => (
                            <ProductItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(product.id, e.target.value, product.categoryId)}
                              />
                              <Button onClick={() => deleteProduct(product.id)}>Delete</Button>
                            </ProductItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {products.map((product, index) => (
                    <Draggable key={product.id} draggableId={String(product.id)} index={index}>
                      {(provided) => (
                        <ProductItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, e.target.value, product.categoryId)}
                          />
                          <Button onClick={() => deleteProduct(product.id)}>Delete</Button>
                        </ProductItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </ProductsContainer>
  );
};

export default Products;
