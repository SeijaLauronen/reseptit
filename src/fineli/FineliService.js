let fineliDataCache = null;

async function getFineliData() {
  if (fineliDataCache) {
    return fineliDataCache;
  }

  const mod = await import('./data/processed/fineli-data.json');
  fineliDataCache = mod.default ?? mod;
  return fineliDataCache;
}

function normalizeText(value) {
  if (!value) return '';

  if (typeof value === 'string') return value.trim();

  if (typeof value === 'object' && value.fi) {
    return String(value.fi).trim();
  }

  return String(value).trim();
}

async function mapFineliItem(item) {
  if (!item) return null;

  const data = await getFineliData();
  const unitDefinitions = data.unitDefinitions ?? {};

  return {
    id: item.id,
    fineliId: String(item.id),
    name: normalizeText(item.name),
    ediblePortion: item.ediblePortion ?? null,

    units: Array.isArray(item.units)
      ? item.units.map(unit => ({
          code: unit?.code ?? '',
          name: unitDefinitions[unit?.code] ?? unit?.code ?? '',
          grams: unit?.grams ?? null,
        }))
      : [],

    nutrients: item.nutrients ?? {},
  };
}

async function search(query) {
  const trimmed = normalizeText(query);

  if (!trimmed) return [];

  const data = await getFineliData();
  const foodsData = data.foods ?? [];
  const q = trimmed.toUpperCase();

  const mapped = await Promise.all(
    foodsData.map(item => mapFineliItem(item))
  );

  return mapped
    .filter(Boolean)
    .filter(item =>
      normalizeText(item.name).toUpperCase().includes(q)
    );
}

async function getById(fineliId) {
  if (
    fineliId === null ||
    fineliId === undefined ||
    fineliId === ''
  ) {
    return null;
  }

  const data = await getFineliData();
  const foodsData = data.foods ?? [];
  const id = String(fineliId);

  const found = foodsData.find(item => String(item.id) === id);

  if (!found) return null;

  return await mapFineliItem(found);
}

const FineliService = {
  search,
  getById,
};

export default FineliService;

/*
let fineliDataCache = null;

async function getFineliData() {
  if (fineliDataCache) {
    return fineliDataCache;
  }

  const mod = await import('./data/processed/fineli-data.json');
  fineliDataCache = mod.default ?? mod;
  return fineliDataCache;
}

function normalizeText(value) {
  if (!value) return '';

  if (typeof value === 'string') return value.trim();

  if (typeof value === 'object' && value.fi) return String(value.fi).trim();

  return String(value).trim();
}

async function mapFineliItem(item) {
  if (!item) return null;

  const data = await getFineliData();
  const unitDefinitions = data.unitDefinitions ?? {};

  return {
    id: item.id,
    fineliId: String(item.id),
    name: normalizeText(item.name),
    ediblePortion: item.ediblePortion ?? null,

    units: Array.isArray(item.units)
      ? item.units.map(unit => ({
          code: unit?.code ?? '',
          name: unitDefinitions[unit?.code] ?? unit?.code ?? '',
          grams: unit?.grams ?? null,
        }))
      : [],

    nutrients: item.nutrients ?? {},
  };
}

async function search(query) {
  const trimmed = normalizeText(query);

  if (!trimmed) return [];

  const data = await getFineliData();
  const foodsData = data.foods ?? [];
  const q = trimmed.toUpperCase();

  const results = await Promise.all(
    foodsData
      .map(item => mapFineliItem(item))
      .filter(Boolean)
      .filter(item =>
        normalizeText(item.name).toUpperCase().includes(q)
      )
  );

  return results;
}

async function getById(fineliId) {
  if (
    fineliId === null ||
    fineliId === undefined ||
    fineliId === ''
  ) {
    return null;
  }

  const data = await getFineliData();
  const foodsData = data.foods ?? [];

  const id = String(fineliId);
  const found = foodsData.find(item => String(item.id) === id);

  if (!found) return null;

  return mapFineliItem(found);
}

const FineliService = {
  search,
  getById,
};

export default FineliService;

*/

/*
import fineliData from './data/processed/fineli-data.json';

const foodsData = fineliData.foods;
const unitDefinitions = fineliData.unitDefinitions;

function normalizeText(value) {
  if (!value) return '';

  if (typeof value === 'string') return value.trim();

  if (typeof value === 'object' && value.fi) return String(value.fi).trim();

  return String(value).trim();
}

function mapFineliItem(item) {
  if (!item) return null;

  return {
    id: item.id,
    fineliId: String(item.id),
    name: normalizeText(item.name),
    ediblePortion: item.ediblePortion ?? null,

    units: Array.isArray(item.units)
      ? item.units.map(unit => ({
          code: unit?.code ?? '',
          name: unitDefinitions[unit?.code] ?? unit?.code ?? '',
          grams: unit?.grams ?? null,
        }))
      : [],

    nutrients: item.nutrients ?? {},
  };
}

async function search(query) {
  const trimmed = normalizeText(query);

  if (!trimmed) return [];

  const q = trimmed.toUpperCase();

  return foodsData
    .map(mapFineliItem)
    .filter(Boolean)
    .filter(item =>
      normalizeText(item.name).toUpperCase().includes(q)
    );
}

async function getById(fineliId) {
  if (
    fineliId === null ||
    fineliId === undefined ||
    fineliId === ''
  ) {
    return null;
  }

  const id = String(fineliId);

  const found = foodsData.find(
    item => String(item.id) === id
  );

  return found ? mapFineliItem(found) : null;
}

const FineliService = {
  search,
  getById,
};

export default FineliService;
*/
