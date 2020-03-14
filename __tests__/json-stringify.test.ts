import { jsonStringify } from '../src/index';

describe('Stringifying an object with all possible values returns the same result as JSON.stringify()', () => {
  const obj = {
    a: true,
    b: 42,
    c: 'abc',
    d: '"abc"',
    e: 'ab\\c',
    f: 'abc' + String.fromCharCode(31),
    g: Buffer.from('abc'),
    h: undefined,
    i: null,
    j: Infinity,
    k: NaN,
    l: new Date(),
    m: {
      one: 1,
      two: 2,
      three: 3,
      nestedObject: {},
      nestedArray: [],
    },
    n: [
      1,
      2,
      3,
      {},
      [],
    ],
    1: Symbol(),
    2: () => {},
    3: new Map(),
  };

  const arr = [
    true,
    42,
    'abc',
    '"abc"',
    'ab\\c',
    'abc' + String.fromCharCode(31),
    Buffer.from('abc'),
    undefined,
    null,
    Infinity,
    NaN,
    new Date(),
    {
      one: 1,
      two: 2,
      three: 3,
      nestedObject: {},
      nestedArray: [],
    },
    [
      1,
      2,
      3,
      {},
      [],
    ],
    Symbol(),
    () => {},
    new Map(),
  ];

  test('Standard object', () => {
    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj);

    expect(result).toEqual(expectedResult);
  });

  test('Array', () => {
    const expectedResult = JSON.stringify(arr);
    const result = jsonStringify(arr);

    expect(result).toEqual(expectedResult);
  });

  test('Standard object, safe set to false', () => {
    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('Array, safe set to false', () => {
    const expectedResult = JSON.stringify(arr);
    const result = jsonStringify(arr, false);

    expect(result).toEqual(expectedResult);
  });
});

describe('Stringifying an object with a circular reference throws an error', () => {
  test('Object with \'safe\' argument set to true', () => {
    const obj: any = {};

    obj.a = obj;

    expect(() => jsonStringify(obj, true)).toThrow('Cannot stringify objects with a circular reference');
  });

  test('Array with \'safe\' argument set to true', () => {
    const arr: any[] = [];

    arr[0] = arr;

    expect(() => jsonStringify(arr, true)).toThrow('Cannot stringify objects with a circular reference');
  });

  test('Object with \'safe\' argument set to false', () => {
    const obj: any = {};

    obj.a = obj;

    expect(() => jsonStringify(obj, false)).toThrow('Maximum call stack size exceeded');
  });

  test('Array with \'safe\' argument set to false', () => {
    const arr: any[] = [];

    arr[0] = arr;

    expect(() => jsonStringify(arr, false)).toThrow('Maximum call stack size exceeded');
  });
});
