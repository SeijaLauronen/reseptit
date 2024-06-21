import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDB } from '../database';

const Container = styled.div`
  padding: 20px;
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CategoryItem = styled.li`
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const db = await getDB();
      const tx = db.transaction('categories', 'readonly');
      const store = tx.objectStore('categories');
      const allCategories = await store.getAll();
      setCategories(allCategories);
    };

    fetchCategories();
  }, []);

  const addCategory = async () => {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.add({ name: newCategory });
    const allCategories = await store.getAll();
    setCategories(allCategories);
    setNewCategory('');
  };

  return (
    <Container>
      <h1>Kategoriat</h1>
      <Input
        type="text"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
      />
      <Button onClick={addCategory}>Add</Button>
      <CategoryList>
        {categories.map(category => (
          <CategoryItem key={category.id}>
            <Input type="text" value={category.name} readOnly />
            {/* Lisää ikoneita tai muita toimintoja */}
          </CategoryItem>
        ))}
      </CategoryList>
    </Container>
  );
};

export default Categories;
