import { openDB } from 'idb';

const DB_NAME = 'ReseptitDB';
const DB_VERSION = 3;
const STORE_NAMES = ['categories', 'products', 'colordefinitions', 'productclasses']; // Määritä taulujen nimet, recipes ja days ei vielä käytössä

const initDB = async () => {
  try {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('categories')) {
          db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('recipes')) {
          db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('days')) {
          db.createObjectStore('days', { keyPath: 'id', autoIncrement: true });
        }
        // versio 2:
        if (!db.objectStoreNames.contains('colordefinitions')) {
          db.createObjectStore('colordefinitions', { keyPath: 'colorId' }); //käytetään id:nä c1,c2, black jne
        }
        // versio 3:
        if (!db.objectStoreNames.contains('productclasses')) {
          db.createObjectStore('productclasses', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export const getDB = async () => {
  try {
    const db = await initDB();
    return db;
  } catch (error) {
    console.error("Failed to get database instance:", error);    
    throw error;// Voit heittää virheen uudelleen tai palauttaa jotakin muuta, kuten null, tilanteen mukaan
  }
};
