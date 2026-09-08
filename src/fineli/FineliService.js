// Simple Fineli service wrapper — mock by default for local testing.
const useRealApi = false; // set to true and implement real calls when API key available

const mockData = [
    { fineliId: '1001', name: 'Maito 1.5% rasvaa', nutrients: { energy: 46, protein: 3.4, fat: 1.5, carbs: 4.8 }, portions: [{ id: 'p1', amount: 100, unit: 'g' }] },
    { fineliId: '1002', name: 'Ruisleipä, viipale', nutrients: { energy: 250, protein: 8.5, fat: 3.5, carbs: 44 }, portions: [{ id: 'p1', amount: 30, unit: 'g' }] },
    { fineliId: '1003', name: 'Omena, punainen', nutrients: { energy: 52, protein: 0.3, fat: 0.2, carbs: 14 }, portions: [{ id: 'p1', amount: 150, unit: 'g' }] }, 
{ fineliId: '1004', name: 'Omena, vihreä', nutrients: { energy: 52, protein: 0.3, fat: 0.2, carbs: 14 }, portions: [{ id: 'p1', amount: 150, unit: 'g' }] }
];

async function search(query) {
    if (!query || query.trim().length === 0) return [];
    if (!useRealApi) {
        const q = query.toLowerCase();
        await new Promise(r => setTimeout(r, 300)); // simulate latency
        return mockData.filter(item => item.name.toLowerCase().includes(q));
    }

    // TODO: implement real Fineli API calls here (fetch/axios), with API key handling
    throw new Error('Real Fineli API not configured');
}

async function getById(fineliId) {
    if (!useRealApi) {
        return mockData.find(d => d.fineliId === String(fineliId)) || null;
    }
    throw new Error('Real Fineli API not configured');
}

export default {
    search,
    getById
};
