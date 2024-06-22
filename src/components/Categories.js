import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const CategoriesContainer = styled.div`
  padding: 20px;
`;

const CategoryItem = styled.div`
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

const Categories = ({ refresh }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    const allCategories = await store.getAll();
    setCategories(allCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]); // Päivitetään, kun refresh muuttuu

  const addCategory = async () => {
    if (newCategory.trim() === "") return;
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.add({ name: newCategory });
    setNewCategory("");
    fetchCategories();
  };

  const updateCategory = async (id, newName) => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    const category = await store.get(id);
    category.name = newName;
    await store.put(category);
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.delete(id);
    fetchCategories();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategories(items);

    // Päivitä järjestys tietokantaan, jos haluat tallentaa uuden järjestyksen
  };

  return (
    <CategoriesContainer>
      <div>
        <Input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
        />
        <Button onClick={addCategory}>Add</Button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {categories.map((category, index) => (
                <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                  {(provided) => (
                    <CategoryItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, e.target.value)}
                      />
                      <Button onClick={() => deleteCategory(category.id)}>Delete</Button>
                    </CategoryItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </CategoriesContainer>
  );
};

export default Categories;
