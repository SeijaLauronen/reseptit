import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getDB } from '../database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import EditCategoryForm from './forms/EditCategoryForm';
import StickyTop from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import {AddButton} from '../components/Button';
import Container, { IconContainer, IconWrapper } from '../components/Container';
import { CategoryItem } from '../components/Item';

const Categories = ({ refresh = false, isMenuOpen, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

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
    const newOrder = categories.length ? Math.max(...categories.map(cat => cat.order)) + 1 : 1;
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
    setEditingCategory(null);
    setIsCategoryFormOpen(false);
  };

  const handleEditCategory = (category) => {
    setIsCategoryFormOpen(true);
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
    setIsCategoryFormOpen(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);

    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');

    for (let i = 0; i < reorderedCategories.length; i++) {
      const category = reorderedCategories[i];
      category.order = i;
      await store.put(category);
    }
  };

  // Container in styled komponentti, käytetään transientti props $isJotain...
  // transientti props $isOpen ei käytetä, koska EditCategoryForm ei ole styled komponentti
  return (
    <>       
      {isCategoryFormOpen && editingCategory && (
        <EditCategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={() => {
            setEditingCategory(null);
            setIsCategoryFormOpen(false);
          }}
          onDelete={handleDeleteCategory}
          isOpen={isCategoryFormOpen}
        />
      )}
        
      <Container $isMenuOpen={isMenuOpen} $isCategoryFormOpen={isCategoryFormOpen}>
            <StickyTop> 
            <b>Kategoriat</b>
            </StickyTop>            
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
                              <IconContainer>
                                <IconWrapper onClick={() => handleEditCategory(category)}>
                                  <FontAwesomeIcon icon={faEdit}/>
                                </IconWrapper>
                                <IconWrapper onClick={() => onCategorySelect(category.id)}>
                                  <FontAwesomeIcon icon={faArrowRight} />
                                </IconWrapper>
                              </IconContainer>
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
      </Container>
      <StickyBottom><InputAdd            
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Uusi kategoria"
            />        
            <AddButton onClick={handleAddCategory}/>
      </StickyBottom>
      
    </>
  );
};

export default Categories;
