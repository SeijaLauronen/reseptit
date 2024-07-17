// dbUtils.js
import { getDB } from './database';

//TODO eri taulujen operaatioit voisi yhdistää lähettämällä taulun nimen ja tietueen parametirnä

// Category DB operations
export const fetchCategories = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    return await store.getAll();
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw new Error('Virhe haettaessa kategorioita: ' + err);
  }
};

export const addCategory = async (category) => {
  try {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');    
    await store.add(category);
  } catch (err) {
    console.error('Error adding category:', err);
    throw new Error('Virhe lisättäessä kategoriaa: ' + err);
  }
};

export const updateCategory = async (id, updatedCategory) => {
  try {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    const category = await store.get(id);
    category.name = updatedCategory.name;
    category.order = updatedCategory.order;
    await store.put(category);
  } catch (err) {
    console.error('Error updating category:', err);
    throw new Error('Virhe päivitettäessä kategoriaa: ' + err);
  }
};

export const deleteCategory = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.delete(id);
  } catch (err) {
    console.error('Error deleting category:', err);
    throw new Error('Virhe poistettaessa kategoriaa: ' + err);
  }
};


// Product DB operations
export const fetchProducts = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    return await store.getAll();
  } catch (err) {
    console.error('Error fetching products:', err);
    throw new Error('Virhe haettaessa tuotteita: ' + err);
  }
};

export const getProductById = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    return await store.get(id);
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    throw new Error('Virhe haettaessa tuotetta ID:llä: ' + err);
  }
};


export const addProduct = async (product) => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const addedId = await store.add(product);
    return addedId;
  } catch (err) {
    console.error('Error adding product:', err);
    throw new Error('Virhe lisättäessä tuotetta: ' + err);
  }
};

export const updateProduct = async (id, updatedProduct) => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    const product = await store.get(id);

    // Päivitetään kaikki annetut kentät, TODO menisikö put käskyllä kuten alempana product päivityksessä...
    for (const key in updatedProduct) {
      if (updatedProduct.hasOwnProperty(key)) {
        product[key] = updatedProduct[key];
      }
    }

    await store.put(product);
  } catch (err) {
    console.error('Error updating product:', err);
    throw new Error('Virhe päivitettäessä tuotetta: ' + err);
  }
};

export const updateProducts = async (products) => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');

    for (let product of products) {
      await store.put(product);
    }
  } catch (err) {
    console.error('Error updating products:', err);
    throw new Error('Virhe päivitettäessä tuotteita: ' + err);
  }
};

export const deleteProduct = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.delete(id);
  } catch (err) {
    console.error('Error deleting product:', err);
    throw new Error('Virhe poistettaessa tuotetta: ' + err);
  }
};