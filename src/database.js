import { openDB } from 'idb';

const DB_NAME = 'ReseptitDB';
const DB_VERSION = 1;

const initDB = async () => {
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
    },
  });
};

export const getDB = async () => {
  const db = await initDB();
  return db;
};

export const clearDB = async () => {
  const db = await getDB();
  await db.clear('categories');
  await db.clear('products');
  await db.clear('recipes');
  await db.clear('days');
};
