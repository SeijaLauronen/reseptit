  import { importCategory, importProduct, updateProduct } from '../controller';

  //TODO tämä totetutus eri tavalla, selkeämmäksi
  export const parseProductLine = (line) => {
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
      // Jos rivillä on kaksi osaa ja ensimmäinen osa on numero
      quantity = parts[0];
      name = parts[1];
    } else if (parts.length === 1) {
      // Tarkistetaan, onko yksittäinen osa numeroiden ja kirjainten yhdistelmä
      const match = parts[0].match(/^(\d+)(\D+)$/);
      if (match) {
        quantity = match[1];
        name = match[2];
      }
    } else {
      // Jos ensimmäinen osa on numero ja osia on enemmän kuin kaksi
      if (!isNaN(parts[0])) {
        quantity = parts[0];
        unit = parts[1];
        name = parts.slice(2).join(' ');
      } else {
        // Yritetään löytää ensimmäinen osa, joka on yhdistelmä numeroa ja kirjaimia
        const match = parts[0].match(/^(\d+)(\D*)$/);
        if (match) {
          quantity = match[1];
          unit = match[2] || '';
          name = parts.slice(1).join(' ');
          if (parts.length === 3 && parts[1] !== '') {
            unit = parts[1];
          }
        } else {
          for (let i = parts.length - 1; i >= 0; i--) {
            // Yritetään löytää viimeinen osa, joka on yhdistelmä numeroa ja kirjaimia
            const match = parts[i].match(/^(\d+)(\D*)$/);
            if (match) {
              quantity = match[1];
              unit = match[2] || '';
              name = parts.slice(0, i).join(' ');
              //yllä oleva löytää myös, jos numero ja sana erikseen kirjoitettu, otetaan sana osa unit:ksi
              if (i === parts.length - 2) {
                unit = parts[i + 1];
              }
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
    }
  
    return {
      prefix,
      name: name.trim(),
      quantity,
      unit
    };
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
  
      if (line.trim().endsWith(':')) {
        const categoryName = line.trim().slice(0, -1);
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
        const { prefix, name, quantity, unit } = parseProductLine(line);
  
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
  