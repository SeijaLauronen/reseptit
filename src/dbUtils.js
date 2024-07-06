// dbUtils.js
import { getDB } from './database';

// Category DB operations
export const fetchCategories = async () => {
  const db = await getDB();
  const tx = db.transaction('categories', 'readonly');
  const store = tx.objectStore('categories');
  return await store.getAll();
};

export const addCategory = async (category) => {
  const db = await getDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  await store.add(category);
};

export const updateCategory = async (id, updatedCategory) => {
  const db = await getDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  const category = await store.get(id);
  category.name = updatedCategory.name;
  category.order = updatedCategory.order;
  await store.put(category);
};

export const deleteCategory = async (id) => {
  const db = await getDB();
  const tx = db.transaction('categories', 'readwrite');
  const store = tx.objectStore('categories');
  await store.delete(id);
};

// Similar functions for products can be added here
