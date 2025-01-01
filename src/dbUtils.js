// dbUtils.js
import { getDB } from './database';
const STORE_NAMES = ['categories', 'products', 'colordefinitions', 'productclasses', 'days']; // Määritä taulujen nimet, TODO kumpaanko näm laitetaan, on myös database.js

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
    const addedId = await store.add(category);
    return addedId;
  } catch (err) {
    console.error('Error adding category:', err);
    throw new Error('Virhe lisättäessä kategoriaa: ' + err);
  }
};

export const getCategoryById = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    return await store.get(id);
  } catch (err) {
    console.error('Error fetching category by ID:', err);
    throw new Error('Virhe haettaessa kategoriaa ID:llä: ' + err);
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


// Lisää tai päivitä värin lisämääreet
export const upsertColorDefinition = async (colorId, definition) => {
  try {
    const db = await getDB();
    const tx = db.transaction('colordefinitions', 'readwrite');
    const store = tx.objectStore('colordefinitions');

    // Tarkista, onko väri jo olemassa
    const existingDefinition = await store.get(colorId);

    if (existingDefinition) {
      // Päivitä olemassa oleva tietue
      Object.assign(existingDefinition, definition);
      await store.put(existingDefinition);
    } else {
      // Lisää uusi tietue
      const newDefinition = { colorId, ...definition };
      await store.add(newDefinition);
    }
  } catch (err) {
    console.error('Error upserting color definition:', err);
    throw new Error('Virhe lisättäessä tai päivitettäessä värin määrittelyä: ' + err);
  }
};


// Hae värin lisämääreet värikoodin perusteella
export const getColorDefinition = async (colorId) => {
  try {
    const db = await getDB();
    const tx = db.transaction('colordefinitions', 'readonly');
    const store = tx.objectStore('colordefinitions');
    return await store.get(colorId);
  } catch (err) {
    console.error('Error fetching color definition:', err);
    throw new Error('Virhe haettaessa värin määrittelyä: ' + err);
  }
};

export const fetchColorDefinitions = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction('colordefinitions', 'readonly');
    const store = tx.objectStore('colordefinitions');
    return await store.getAll();
  } catch (err) {
    console.error('Error fetching color definitions:', err);
    throw new Error('Virhe haettaessa värin määrittelyä: ' + err);
  }
};


// Productclass DB operations
export const fetchProductclasses = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction('productclasses', 'readonly');
    const store = tx.objectStore('productclasses');
    return await store.getAll();
  } catch (err) {
    console.error('Error fetching productclasses:', err);
    throw new Error('Virhe haettaessa tuoteluokkia: ' + err);
  }
};

export const addProductclass = async (productclass) => {
  try {
    const db = await getDB();
    const tx = db.transaction('productclasses', 'readwrite');
    const store = tx.objectStore('productclasses');
    const addedId = await store.add(productclass);
    return addedId;
  } catch (err) {
    console.error('Error adding productclass:', err);
    throw new Error('Virhe lisättäessä tuoteluokkaa: ' + err);
  }
};

export const getProductclassById = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('productclasses', 'readonly');
    const store = tx.objectStore('productclasses');
    return await store.get(id);
  } catch (err) {
    console.error('Error fetching productclasses by ID:', err);
    throw new Error('Virhe haettaessa tuoteluokkaa ID:llä: ' + err);
  }
};

export const updateProductclass = async (id, updatedProductclass) => {
  try {
    const db = await getDB();
    const tx = db.transaction('productclasses', 'readwrite');
    const store = tx.objectStore('productclasses');
    const productclass = await store.get(id);
    productclass.name = updatedProductclass.name;
    productclass.order = updatedProductclass.order;
    await store.put(productclass);
  } catch (err) {
    console.error('Error updating productclass:', err);
    throw new Error('Virhe päivitettäessä tuoteluokkaa: ' + err);
  }
};

// TODO tuotteilta pois viittaukset deletoitavaan...
export const deleteProductclass = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('productclasses', 'readwrite');
    const store = tx.objectStore('productclasses');
    await store.delete(id);
  } catch (err) {
    console.error('Error deleting productclass:', err);
    throw new Error('Virhe poistettaessa tuoteluokkaa: ' + err);
  }
};


/* Days, päiväsuunnitelmat */
export const fetchDays = async () => {
  try {
    const db = await getDB();
    const tx = db.transaction('days', 'readonly');
    const store = tx.objectStore('days');
    return await store.getAll();
  } catch (err) {
    console.error('Error fetching days:', err);
    throw new Error('Virhe haettaessa päiväsuunnitelmia: ' + err);
  }
};


export const addDay = async (day) => {
  try {
    const db = await getDB();
    const tx = db.transaction('days', 'readwrite');
    const store = tx.objectStore('days');
    const addedId = await store.add(day);
    return addedId;
  } catch (err) {
    console.error('Error adding day:', err);
    throw new Error('Virhe lisättäessä päiväsuunnitelmaa: ' + err);
  }
};

export const updateDay = async (id, updatedDay) => {
  try {
    const db = await getDB();
    const tx = db.transaction('days', 'readwrite');
    const store = tx.objectStore('days');
    const day = await store.get(id);

    // Päivitetään kaikki annetut kentät, TODO menisikö put käskyllä kuten alempana product päivityksessä...
    for (const key in updatedDay) {
      if (updatedDay.hasOwnProperty(key)) {
        day[key] = updatedDay[key];
      }
    }

    await store.put(day);
  } catch (err) {
    console.error('Error updating day:', err);
    throw new Error('Virhe päivitettäessä päiväsuunnitelmaa: ' + err);
  }
};

export const deleteDay = async (id) => {
  try {
    const db = await getDB();
    const tx = db.transaction('days', 'readwrite');
    const store = tx.objectStore('days');
    await store.delete(id);
  } catch (err) {
    console.error('Error deleting day:', err);
    throw new Error('Virhe poistettaessa päiväsuunnitelmaa: ' + err);
  }
};
/* Days end*/












//TODO tämä on myös tuolla database.js:ssä Valitse jompi kumpi
// TODO käytetään vakioita, luupataan se
export const clearDatabase = async () => {
  try {
    const db = await getDB();
    if (db.objectStoreNames.contains('categories')) {
      await db.clear('categories');
    }
    if (db.objectStoreNames.contains('products')) {
      await db.clear('products');
    }
    if (db.objectStoreNames.contains('recipes')) {
      await db.clear('recipes');
    }
    if (db.objectStoreNames.contains('days')) {
      await db.clear('days');
    }
    if (db.objectStoreNames.contains('colordefinitions')) {
      await db.clear('colordefinitions');
    }
    if (db.objectStoreNames.contains('productclasses')) {
      await db.clear('productclasses');
    }
  } catch (err) {
    console.error('Error clearing DB:', err);
    throw new Error('Virhe tietojen poistamisessa: ' + err.message);
  }
};

export const importDataToDatabase = async (data) => {
  try {
    const db = await getDB();
    for (const storeName of STORE_NAMES) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear(); // Tyhjennä taulu ennen uusien tietojen lisäämistä
      const items = data[storeName] || [];
      for (const item of items) {
        try {
          await store.add(item);
        } catch (err) {
          console.error(`Error adding item to store ${storeName}:`, err);
          throw new Error(`Virhe lisättäessä tietoa tauluun ${storeName}: ${err.message}`);
        }
      }
      await tx.done;
    }
  } catch (err) {
    console.error('Error importing data:', err);
    throw new Error('Virhe tietojen lataamisessa: ' + err.message);
  }
};

export const exportDataFromDatabase = async () => {
  try {
    const db = await getDB();
    const result = {};
    for (const storeName of STORE_NAMES) {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const data = await store.getAll();
      result[storeName] = data;
      await tx.done;
    }
    return result;
  } catch (err) {
    console.error('Error exporting data:', err);
    throw new Error('Virhe tietojen hakemisessa: ' + err.message);
  }
};

export const loadExampleDataToDatabase = async (exampleData) => {
  try {
    const db = await getDB();
    for (const storeName of STORE_NAMES) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear(); // Tyhjennä taulu ennen esimerkkiaineiston lisäämistä
      const items = exampleData[storeName] || [];
      for (const item of items) {
        await store.add(item);
      }
      await tx.done;
    }
  } catch (err) {
    console.error('Error loading exampledata:', err);
    throw new Error('Virhe esimerkkitietojen lataamisessa: ' + err.message);
  }
};

