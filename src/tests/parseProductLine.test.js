const { parseProductLine } = require('../utils/dataUtils');

describe('parseProductLine', () => {

  test('line starts with number, then unit and name', () => {
    const result = parseProductLine('1 kpl kurkku');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkku',
      quantity: '1',
      unit: 'kpl'
    });
  });

  test('line starts with number having quatity and unit together, then name', () => {
    const result = parseProductLine('1kpl kurkku');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkku',
      quantity: '1',
      unit: 'kpl'
    });
  });

  test('line starts with number, then name, no unit', () => {
    const result = parseProductLine('2 kurkkua');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: ''
    });
  });

  test('line starts with number,  quantity and name together', () => {
    const result = parseProductLine('2kurkkua');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: ''
    });
  });

  test('parses line with prefix * ', () => {
    const result = parseProductLine('* 2 kpl kurkkua');
    expect(result).toEqual({
      prefix: '*',
      name: 'kurkkua',
      quantity: '2',
      unit: 'kpl'
    });
  });

  test('parses line with prefix - ', () => {
    const result = parseProductLine('- 2 kpl kurkkua');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: 'kpl'
    });
  });

  test('line starts with letter, then quantity and unit', () => {
    const result = parseProductLine('kurkkua 2 kpl');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: 'kpl'
    });
  });

  test('line starts with letter, then quantity and unit together', () => {
    const result = parseProductLine('kurkkua 2kpl');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: 'kpl'
    });
  });

  test('line starts with letter, then quantity', () => {
    const result = parseProductLine('kurkkua 2');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkkua',
      quantity: '2',
      unit: ''
    });
  });

  test('line has only name', () => {
    const result = parseProductLine('kurkku');
    expect(result).toEqual({
      prefix: '-',
      name: 'kurkku',
      quantity: '',
      unit: ''
    });
  });

  test('line with multiple words in name, no quantity', () => {
    const result = parseProductLine('luomu kurkku');
    expect(result).toEqual({
      prefix: '-',
      name: 'luomu kurkku',
      quantity: '',
      unit: ''
    });
  });

  test('line with multiple words in name, quantity and unit', () => {
    const result = parseProductLine('luomu kurkku 2 kpl');
    expect(result).toEqual({
      prefix: '-',
      name: 'luomu kurkku',
      quantity: '2',
      unit: 'kpl'
    });
  });

});
