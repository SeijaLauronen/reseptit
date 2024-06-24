import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditCategoryForm from './EditCategoryForm';

const Container = styled.div`
  padding: 20px;
`;

const CategoryItem = styled.div`
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

const Categories = ({ refresh = false }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const db = await getDB();
      const tx = db.transaction('categories', 'readonly');
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();
      setCategories(allCategories.sort((a, b) => a.order - b.order));
    };

    fetchCategories();
  }, [refresh]);

  const handleAddCategory = async () => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    const newOrder = categories.length ? Math.max(categories.map(cat => cat.order)) + 1 : 1;
    await store.add({ name: newCategory, order: newOrder });
    setNewCategory('');
    const allCategories = await store.getAll();
    setCategories(allCategories.sort((a, b) => a.order - b.order));
  };

  const handleDeleteCategory = async (id) => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.delete(id);
    const allCategories = await store.getAll();
    setCategories(allCategories.sort((a, b) => a.order - b.order));
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleSaveCategory = async (id, updatedCategory) => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    const category = await store.get(id);
    category.name = updatedCategory.name;
    await store.put(category);
    const allCategories = await store.getAll();
    setCategories(allCategories.sort((a, b) => a.order - b.order));
    setEditingCategory(null);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);

    // Save the reordered categories to the database
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');

    for (let i = 0; i < reorderedCategories.length; i++) {
      const category = reorderedCategories[i];
      category.order = i;
      await store.put(category);
    }
  };

  return (
    <Container>
      <h1>Categories</h1>
      {editingCategory ? (
        <EditCategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => setEditingCategory(null)}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <>
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
          />
          <button onClick={handleAddCategory}>Add</button>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categories.map((category, index) => (
                    <Draggable key={category.id.toString()} draggableId={category.id.toString()} index={index}>
                      {(provided) => (
                        <CategoryItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <span>{category.name}</span>
                          <div>
                            <IconWrapper onClick={() => handleEditCategory(category)}>
                              <FontAwesomeIcon icon={faEdit} />
                            </IconWrapper>
                          </div>
                        </CategoryItem>
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

export default Categories;
