import { fetchCategories, addCategory as dbAddCategory, updateCategory as dbUpdateCategory, deleteCategory as dbDeleteCategory } from './dbUtils';
import { fetchProducts, getProductById as dbGetProductById, addProduct as dbAddProduct, updateProduct as dbUpdateProduct, updateProducts as dbUpdateProducts, deleteProduct as dbDeleteProduct } from './dbUtils';

const validateCategory = (category) => { 
  if (!category.name || category.name.trim() === '') {
    return 'Nimi on pakollinen tieto';
  }
  return null;
};

export const getCategories = async (sortByOrder = true) => {
    const categories = await fetchCategories();
    if (sortByOrder) {
      return categories.sort((a, b) => a.order - b.order);
    } 
    return categories.sort((a, b) => a.name.localeCompare(b.name));  
};

export const addCategory = async (category) => {
  const error = validateCategory(category);
  if (error) {
    throw new Error(error);
  }
  await dbAddCategory(category);
};

export const updateCategory = async (id, updatedCategory) => {
  const error = validateCategory(updatedCategory);
  if (error) {
    throw new Error(error);
  }
  await dbUpdateCategory(id, updatedCategory);
};
 
export const deleteCategory = async (id) => {
  await dbDeleteCategory(id);
};

// Similar functions for products can be added here

const validateProduct = (product) => { 
    if (!product.name || product.name.trim() === '') {
      return 'Nimi on pakollinen tieto';
    }
    return null;
};

export const getProducts = async () => {
    const products = await fetchProducts();
    return products.sort((a, b) => a.name.localeCompare(b.name));  
};

export const addProduct = async (product) => {
    const error = validateProduct(product);
    if (error) {
      throw new Error(error);
    }
    const addedId = await dbAddProduct(product);
    return addedId;
};

export const updateProduct = async (id, updatedProduct) => {
    const error = validateProduct(updatedProduct);
    if (error) {
      throw new Error(error);
    }
    await dbUpdateProduct(id, updatedProduct);
};

//TODO validointi tarvittaessa
export const updateProducts = async (products) => {
  await dbUpdateProducts(products);
};

export const getProductById = async (id) => {
  return await dbGetProductById(id);  
};


export const deleteProduct = async (id) => {
    await dbDeleteProduct(id);
};

export const getProductsOnShoppingList = async () => {
  const products = await fetchProducts();
  return products.filter(product => product.onShoppingList);
};

export const updateProductField = async (id, field, value) => {
  const product = await getProductById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  
  product[field] = value;
  await dbUpdateProduct(id, product);
};