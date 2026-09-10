// npx jest "src/fineli/FineliService.test.js" --runInBand --no-cache
// npx jest "src/fineli/FineliService.test.js" --watch

import FineliService from './FineliService';

describe('FineliService', () => {
  test('searches the local processed Fineli dataset by product name', async () => {
    const results = await FineliService.search('omena');

    expect(results.length).toBeGreaterThan(0);
    expect(results.map(item => item.name)).toEqual(
      expect.arrayContaining([
        'OMENA, KOTIMAINEN, KUORINEEN',
        'OMENA, ULKOMAINEN, KUORINEEN',
      ])
    );
  });

  test('returns a selected item by id', async () => {
    const result = await FineliService.getById(28941);

    expect(result).toMatchObject({
      id: 28941,
      name: 'OMENA, KOTIMAINEN, KUORINEEN',
      ediblePortion: 87,
    });
    expect(Array.isArray(result.units)).toBe(true);
    expect(result.units[0]).toMatchObject({ code: 'PORTM', grams: 200 });
  });
});
