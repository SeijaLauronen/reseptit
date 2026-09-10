import foodsData from './data/processed/fineli-data.json';

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
    units: Array.isArray(item.units) ? item.units.map(unit => ({
      code: unit?.code ?? '',
      grams: Number(unit?.grams ?? 0),
    })) : [],
    nutrients: item.nutrients ?? {},
  };
  
/*
  return {
    id: 1,
    fineliId: 1,
    name: "OMENA, KOTIMAINEN, KUORINEEN",
    ediblePortion: null,
    units:  [],
    nutrients: {},
  };
*/
}

async function search(query) {
  const trimmed = normalizeText(query);
  if (!trimmed) return [];

  const q = trimmed.toUpperCase();
    
  return foodsData
    .map(mapFineliItem)
    .filter(Boolean)
    .filter(item => normalizeText(item.name).toUpperCase().includes(q));
}

async function getById(fineliId) {
  if (fineliId === null || fineliId === undefined || fineliId === '') return null;

  const id = String(fineliId);
  const found = foodsData.find(item => String(item.id) === id);
  return found ? mapFineliItem(found) : null;
}

const FineliService = {
  search,
  getById,
};

export default FineliService;
