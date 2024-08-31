
const { importShoppinglistData } = require('../utils/dataUtils');

describe('importShoppinglistData', () => {
    //test.only('category line', async () => { //yritetään testata vain tätä testiä, en saanut toimimaan

    // Mock category, product and functions
    const mockImportCategory = jest.fn(({ name }) => Promise.resolve({ id: Date.now(), name }));
    const mockImportProduct = jest.fn(({ name, categoryId }) => Promise.resolve({ id: Date.now(), name, categoryId }));
    const mockUpdateProduct = jest.fn();

    const mockNoCategoryName = 'Ei kategoriaa';

    test('category line an products', async () => {
        //jest.setTimeout(20000); // Debuggauksessa Aseta aikakatkaisuksi 20 sekuntia (20000 ms)

        const mockCategories = [];
        const mockProducts = [];

        const importText = `
      Vihannekset:
      kurkku 2 kpl 
      Hedelmät:
      omena 3
      ${mockNoCategoryName}:
      1 maito
    `;

        // Kun käytetään mock-funktioita testissä, ne syötetäään testattavalle funktiolle sen sijaan, että käytettäisiin oikeita funktioita.
        // Kutsussa ensin annetaan parametrit ja sitten mock-funktiot, jotka korvaavat importissa annetut funktiot
        // Injecting mock functions
        const { addedCategories, addedProducts, updatedProducts } = await importShoppinglistData(
            importText,
            mockCategories,
            mockProducts,
            mockNoCategoryName,
            mockImportCategory,
            mockImportProduct,
            mockUpdateProduct
        );

        // Verifying that categories are correctly created and identified
        expect(addedCategories.length).toBe(2);
        expect(addedCategories[0].name).toBe('Vihannekset');
        expect(addedCategories[1].name).toBe('Hedelmät');

        // Verifying that products are correctly associated with categories
        expect(addedProducts.length).toBe(3);
        expect(addedProducts[0].name).toBe('kurkku');
        expect(addedProducts[0].quantity).toBe('2');
        expect(addedProducts[0].unit).toBe('kpl');
        expect(addedProducts[0].categoryId).toBe(addedCategories[0].id);

        expect(addedProducts[1].name).toBe('omena');
        expect(addedProducts[1].quantity).toBe('3');
        expect(addedProducts[1].unit).toBeNull();
        expect(addedProducts[1].categoryId).toBe(addedCategories[1].id);

        // Verifying that products under "No Category" are handled correctly
        expect(addedProducts[2].name).toBe('maito');
        expect(addedProducts[2].quantity).toBe('1');
        expect(addedProducts[2].unit).toBeNull();
        expect(addedProducts[2].categoryId).toBeNull();

        // Ensure no products are updated (only added)
        expect(updatedProducts.length).toBe(0);
    });

    test('category line ending with extra space', async () => {
        const mockCategories = [];
        const mockProducts = [];
        const importText = `Leivät: `;
        const { addedCategories, addedProducts, updatedProducts } = await importShoppinglistData(
            importText,
            mockCategories,
            mockProducts,
            mockNoCategoryName,
            mockImportCategory,
            mockImportProduct,
            mockUpdateProduct
        );

        expect(addedCategories.length).toBe(1);
        expect(addedCategories[0].name).toBe('Leivät');
        expect(addedProducts.length).toBe(0);
        expect(updatedProducts.length).toBe(0);

    });

    test('products without category', async () => {
        const mockCategories = [];
        const mockProducts = [];
        const importText = `
        kurkkua
        tomaattia
        leipää
        `;
        const { addedCategories, addedProducts, updatedProducts } = await importShoppinglistData(
            importText,
            mockCategories,
            mockProducts,
            mockNoCategoryName,
            mockImportCategory,
            mockImportProduct,
            mockUpdateProduct
        );

        expect(addedCategories.length).toBe(0);
        expect(addedProducts.length).toBe(3);
        expect(addedProducts[0].name).toBe('kurkkua');
        expect(addedProducts[1].name).toBe('tomaattia');
        expect(addedProducts[2].name).toBe('leipää');        
        expect(updatedProducts.length).toBe(0);

    });

});

test('Node.js version', () => {
    console.log("Node version:", process.version);
});



