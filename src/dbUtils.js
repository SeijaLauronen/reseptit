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

// Product DB operations
export const fetchProducts = async () => {
    const db = await getDB();
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    return await store.getAll();
};

export const addProduct = async (product) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const addedId = await store.add(product);
    return addedId;
};


//TODO ei luetella yksittäisiä päivitettäviä kenttiä, niitä tulee lisää...
export const updateProduct = async (id, updatedProduct) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);
    product.name = updatedProduct.name;
    product.categoryId = updatedProduct.categoryId;
    await store.put(product);
};

  export const deleteProduct = async (id) => {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.delete(id);
  };