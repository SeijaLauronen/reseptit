import { fetchCategories, addCategory as dbAddCategory, getCategoryById as dbGetCategoryById, updateCategory as dbUpdateCategory, deleteCategory as dbDeleteCategory } from './dbUtils';
import { fetchProducts, getProductById as dbGetProductById, addProduct as dbAddProduct, updateProduct as dbUpdateProduct, updateProducts as dbUpdateProducts, deleteProduct as dbDeleteProduct } from './dbUtils';
import { clearDatabase } from './dbUtils'; //TODO tarvitaankohan
import { importDataToDatabase, exportDataFromDatabase, loadExampleDataToDatabase } from './dbUtils';
import { upsertColorDefinition as dbUpsertColorDefinition, getColorDefinition as dbGetColorDefinition}  from './dbUtils';
import { fetchProductclasses, addProductclass as dbAddProductclass, updateProductclass as dbUpdateProductclass, deleteProductclass as dbDeleteProductclass } from './dbUtils';

export const handleImportData = async (data) => {
  try {
    return await importDataToDatabase(data);
  } catch (error) {
    console.log("VIRHE:" + error.message)
    throw error;
  }
};

export const handleExportData = async () => {
  return await exportDataFromDatabase();
};

// Tällehän pitäisi tulla data, ja funkka sama kuin import...
export const handleLoadExample = async () => {
  return await loadExampleDataToDatabase();
};


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
  const addedId = await dbAddCategory(category);
  return addedId;
};

export const importCategory = async (category) => {
  const error = validateCategory(category);
  if (error) {
    throw new Error(error);
  }
  //Importatulla kategorialla ei ole order-tietoa
  const categories = await fetchCategories();
  const newOrder = categories.length ? Math.max(...categories.map(cat => cat.order)) + 1 : 1;
  category.order = newOrder;
  const addedId = await dbAddCategory(category);
  const addedCategory = await dbGetCategoryById(addedId);
  return addedCategory;
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

export const importProduct = async (product) => {
  const error = validateProduct(product);
  if (error) {
    throw new Error(error);
  }
  const addedId = await dbAddProduct(product);
  const importedProduct = await dbGetProductById(addedId);
  return importedProduct;
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
  //const products = await fetchProducts();
  const products = await getProducts(); //Valmiiksi lajiteltu aakkosittain!
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


// Validointifunktio värin lisämääreille
const validateColorDefinition = (colorId, definition) => {
  if (!colorId || colorId.trim() === '') {
      return 'Color ID on pakollinen tieto';
  }
  if (!definition) {
      return 'Värin lisämääre on pakollinen';
  }
  return null;
};

// Lisää tai päivitä värin lisämääre
export const upsertColorDefinition = async (colorId, definition) => {
  const error = validateColorDefinition(colorId, definition);
  if (error) {
      throw new Error(error);
  }
  await dbUpsertColorDefinition(colorId, definition);
};

// Hae värin lisämääre tietokannasta
export const getColorDefinition = async (colorId) => {
  const colorDefinition = await dbGetColorDefinition(colorId);
  return colorDefinition;
};

// Productclass
const validateProductclass = (productclass) => {
  if (!productclass.name || productclass.name.trim() === '') {
    return 'Nimi on pakollinen tieto';
  }
  return null;
};

export const getProductclasses = async (sortByOrder = true) => {
  const productclasses = await fetchProductclasses();
  if (sortByOrder) {
    return productclasses.sort((a, b) => a.order - b.order);
  }
  return productclasses.sort((a, b) => a.name.localeCompare(b.name));
};

export const addProductclass = async (productclass) => {
  const error = validateCategory(productclass);
  if (error) {
    throw new Error(error);
  }
  const addedId = await dbAddProductclass(productclass);
  return addedId;
};

export const updateProductclass = async (id, updatedProductclass) => {
  const error = validateProductclass(updatedProductclass);
  if (error) {
    throw new Error(error);
  }
  await dbUpdateProductclass(id, updatedProductclass);
};

export const deleteProductclass = async (id) => {
  await dbDeleteProductclass(id);
};






//Tietokannan tyhjennys
export const deleteAllData = async (data) => {
  await clearDatabase();
};

// Tietokantaan tiedot
export const importData = async (data) => {
  await clearDatabase();
  await importDataToDatabase(data);
};

// Tietokannan tiedot haetaan
export const exportData = async () => {
  const data = await exportDataFromDatabase();
  return data;
};



// TODO tätä ei käytetä täältä, on suoraan UI:llä. 
// Jos haettaisiin pub hakemistosta, käytettäisiin fetc, mutta reititys pitäisi huolehtia...
export const loadExampleData = async () => {
  // Oletetaan, että esimerkkiaineisto on tallennettu tiedostoon
  const response = await fetch('/path/to/exampleData.json');
  const data = await response.json();
  await clearDatabase();
  await importDataToDatabase(data);
};

