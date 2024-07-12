import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import EditCategoryForm from './forms/EditCategoryForm';
import StickyTop from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import Container, { IconContainer, IconWrapper } from '../components/Container';
import { CategoryItem } from '../components/Item';
import Toast from '../components/Toast'; 

const Categories = ({ refresh = false, isMenuOpen, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchAndSetCategories = async () => {
    try {
      const allCategories = await getCategories();
      setCategories(allCategories);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, [refresh]);

  const handleAddCategory = async () => {
    try {
      const newOrder = categories.length ? Math.max(...categories.map(cat => cat.order)) + 1 : 1;
      await addCategory({ name: newCategory, order: newOrder });
      setNewCategory('');
      fetchAndSetCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      fetchAndSetCategories();
      setEditingCategory(null);
      setIsCategoryFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategory = (category) => {
    setIsCategoryFormOpen(true);
    setEditingCategory(category);
  };


  const handleSaveCategory = async (id, updatedCategory) => {
    try {
      await updateCategory(id, updatedCategory);
      fetchAndSetCategories();
      setEditingCategory(null);
      setIsCategoryFormOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedCategories = Array.from(categories);
    const [removed] = reorderedCategories.splice(result.source.index, 1);
    reorderedCategories.splice(result.destination.index, 0, removed);

    setCategories(reorderedCategories);

    try {
      // Päivitetään järjestys tietokantaan
      for (let i = 0; i < reorderedCategories.length; i++) {
        reorderedCategories[i].order = i + 1; // Päivitetään order kenttä
        await updateCategory(reorderedCategories[i].id, reorderedCategories[i]);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  // Container in styled komponentti, käytetään transientti props $isJotain...
  // transientti props $isOpen ei käytetä, koska EditCategoryForm ei ole styled komponentti
  return (
    <>  
      { error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

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
                                  <FontAwesomeIcon icon={faEdit} />
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
      <StickyBottom>
        <InputAdd            
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
