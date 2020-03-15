import { jsonStringify } from '../src/index';

describe('Calling JSON.parse() on a stringifed object with all possible values returns the same result as JSON.stringify()', () => {
  const obj = {
    a: true,
    b: 42,
    c: 'abc',
    d: Buffer.from('abc'),
    e: undefined,
    f: null,
    g: Infinity,
    h: NaN,
    i: new Date(),
    j: '😀',
    k: Symbol(),
    l: () => {},
    m: new Map(),
    n: {
      one: 1,
      two: 2,
      three: 3,
      nestedObject: {},
      nestedArray: [],
    },
    o: [
      1,
      2,
      3,
      {},
      [],
    ],
  };

  const arr = [
    true,
    42,
    'abc',
    Buffer.from('abc'),
    undefined,
    null,
    Infinity,
    NaN,
    new Date(),
    '😀',
    Symbol(),
    () => {},
    new Map(),
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
  ];

  test('Standard object', () => {
    const expectedResult = JSON.parse(JSON.stringify(obj));
    const result = JSON.parse(jsonStringify(obj));

    expect(result).toEqual(expectedResult);
  });

  test('Array', () => {
    const expectedResult = JSON.parse(JSON.stringify(arr));
    const result = JSON.parse(jsonStringify(arr));

    expect(result).toEqual(expectedResult);
  });

  test('Standard object, safe set to false', () => {
    const expectedResult = JSON.parse(JSON.stringify(obj));
    const result = JSON.parse(jsonStringify(obj, false));

    expect(result).toEqual(expectedResult);
  });

  test('Array, safe set to false', () => {
    const expectedResult = JSON.parse(JSON.stringify(arr));
    const result = JSON.parse(jsonStringify(arr, false));

    expect(result).toEqual(expectedResult);
  });
});

describe('Stringifying an object with one string value returns the same result as JSON.stringify() when the string includes', () => {
  test('an ASCII control character', () => {
    const obj = { a: 'abc' + String.fromCharCode(31) };

    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('a double quote (")', () => {
    const obj = { a: '"abc"' };

    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('a backslash (\\)', () => {
    const obj = { a: 'ab\\c' };

    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('a UTF-16 surrogate pair (0xD83D 0xDE00 😀)', () => {
    const obj = { a: '😀' };

    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('a lone leading surrogate (0xD83D)', () => {
    const obj = { a: '\uD83D' };


    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });

  test('a lone trailing surrogate (0xDE00)', () => {
    const obj = { a: '\uDE00' };

    const expectedResult = JSON.stringify(obj);
    const result = jsonStringify(obj, false);

    expect(result).toEqual(expectedResult);
  });
});

describe('Stringifying an object with a BigInt throws an error', () => {
  test('Object', () => {
    const obj = { foo: BigInt(42) };

    expect(() => jsonStringify(obj, true)).toThrow('Cannot serialize objects that contain a BigInt');
  });

  test('Array', () => {
    const arr = [BigInt(42)];

    expect(() => jsonStringify(arr, true)).toThrow('Cannot serialize objects that contain a BigInt');
  });
});

describe('Stringifying an object with a circular reference throws an error', () => {
  test('Object with \'safe\' argument set to true', () => {
    const obj: any = {};

    obj.a = obj;

    expect(() => jsonStringify(obj, true)).toThrow('Cannot serialize objects that contain a circular reference');
  });

  test('Array with \'safe\' argument set to true', () => {
    const arr: any[] = [];

    arr[0] = arr;

    expect(() => jsonStringify(arr, true)).toThrow('Cannot serialize objects that contain a circular reference');
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
