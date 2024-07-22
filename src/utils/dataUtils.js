// utils/dataUtils.js
  import { importCategory, importProduct, updateProduct } from '../controller';

  export const importData = async (data) => {
    // Import data to database
  };
  
  export const importShoppinglistData = async (importText, categories, allProducts, noCategoryName) => {
    const lines = importText.split('\n');
    let currentCategory = null;
    const currentAllCategories = [...categories];
    const currentAllProducts = [...allProducts];
    const addedCategories = [];
    const updatedProducts = [];
    const addedProducts = [];
  
    for (const line of lines) {
      if (line.trim() === '') continue;
  
      if (line.endsWith(':')) {
        const categoryName = line.slice(0, -1).trim();
        if (categoryName === noCategoryName) {
          currentCategory = null;
        } else {
          let category = currentAllCategories.find(cat => cat.name === categoryName);
          if (!category) {
            category = await importCategory({ name: categoryName });
            addedCategories.push(category);
            currentAllCategories.push(category);
          }
          currentCategory = category;
        }
      } else {
        const trimmedLine = line.trim();
        let prefix = '-';
        let content = trimmedLine;
  
        if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
          prefix = trimmedLine[0];
          content = trimmedLine.slice(1).trim();
        }
  
        let name = content;
        let quantity = '';
        let unit = '';
  
        const parts = content.split(' ');
  
        if (parts.length === 2 && !isNaN(parts[0])) {
          // If the line has two parts and the first part is a number
          quantity = parts[0];
          name = parts[1];
        } else if (parts.length === 1) {
          // Check if the single part is a combination of number and letters
          const match = parts[0].match(/^(\d+)(\D+)$/);
          if (match) {
            quantity = match[1];
            name = match[2];
          }
        } else {
          // Try to find the first part that is a combination of number and letters at the start
          const match = parts[0].match(/^(\d+)(\D*)$/);
          if (match) {
            quantity = match[1];
            unit = match[2] || '';
            name = parts.slice(1).join(' ');
          } else {
            // Try to find the last part that is a combination of number and letters
            for (let i = parts.length - 1; i >= 0; i--) {
              const match = parts[i].match(/^(\d+)(\D*)$/);
              if (match) {
                quantity = match[1];
                unit = match[2] || '';
                name = parts.slice(0, i).join(' ');
                break;
              } else if (!isNaN(parts[i])) {
                quantity = parts[i];
                name = parts.slice(0, i).join(' ');
                if (i + 1 < parts.length) {
                  unit = parts[i + 1];
                }
                break;
              }
            }
          }
        }
  
        const categoryId = currentCategory ? currentCategory.id : null;
        const trimmedName = name.trim();
  
        let product = currentAllProducts.find(prod => prod.name === trimmedName && prod.categoryId === categoryId);
        if (!product) {
          product = await importProduct({
            name: trimmedName,
            categoryId: categoryId,
            quantity: quantity || null,
            unit: unit || null,
            onShoppingList: true,
            selected: prefix === '*',
          });
          addedProducts.push(product);
        } else {
          await updateProduct(product.id, {
            ...product,
            quantity: quantity || product.quantity,
            unit: unit || product.unit,
            onShoppingList: true,
            selected: prefix === '*',
          });
          updatedProducts.push(product);
        }
        currentAllProducts.push(product);
      }
    }
  
    return {
      addedCategories,
      addedProducts,
      updatedProducts
    };
  };
  
  
  

  export const exportData = async () => {
    // Export data from database
  };
  
  export const loadExampleData = async () => {
    // Load example data from a file or predefined object
  };
  
  export const clearDatabase = async () => {
    // Clear the database
  };
  
  export const getDatabaseContents = async () => {
    // Get contents of the database to check if it's empty
  };
  
  export const insertData = async (data) => {
    // Insert data into the database
  };
  
  // Utility functions
  export const selectFile = async () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      input.click();
    });
  };
  
  export const downloadFile = (data, filename) => {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };
  