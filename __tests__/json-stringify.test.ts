import jsonStringify from '../src/index';

test('Stringifying an object with all possible values returns the same result as JSON.stringify()', () => {
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
    },
    n: [
      1,
      2,
      3,
    ],
    o: Symbol(),
    p: () => {},
    q: new Map(),
  };

  const expectedResult = JSON.stringify(obj);
  const result = jsonStringify(obj);

  expect(result).toEqual(expectedResult);
});

test('Stringifying an array with all possible values returns the same result as JSON.stringify()', () => {
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
    },
    [
      1,
      2,
      3,
    ],
    Symbol(),
    () => {},
    new Map(),
  ];

  const expectedResult = JSON.stringify(arr);
  const result = jsonStringify(arr);

  expect(result).toEqual(expectedResult);
});

test('Stringifying an object with a circular reference throws an error', () => {
  const obj: any = {};

  obj.a = obj;

  expect(() => jsonStringify(obj)).toThrow('Maximum call stack size exceeded');
});

test('Stringifying an array with a circular reference throws an error', () => {
  const arr: any[] = [];

  arr[0] = arr;

  expect(() => jsonStringify(arr)).toThrow('Maximum call stack size exceeded');
});
