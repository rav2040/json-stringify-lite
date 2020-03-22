import { stableJsonStringify } from '../src/index';

describe('Serializing a single value returns the same result as JSON.stringfy()', () => {
  test('undefined', () => {
    const expectedResult = JSON.stringify(undefined);
    const result = stableJsonStringify(undefined);

    expect(result).toEqual(expectedResult);
  });

  test('boolean', () => {
    const expectedResult = JSON.stringify(true);
    const result = stableJsonStringify(true);

    expect(result).toEqual(expectedResult);
  });

  test('number', () => {
    const expectedResult = JSON.stringify(42);
    const result = stableJsonStringify(42);

    expect(result).toEqual(expectedResult);
  });

  test('number (Infinity)', () => {
    const expectedResult = JSON.stringify(Infinity);
    const result = stableJsonStringify(Infinity);

    expect(result).toEqual(expectedResult);
  });

  test('number (NaN)', () => {
    const expectedResult = JSON.stringify(NaN);
    const result = stableJsonStringify(NaN);

    expect(result).toEqual(expectedResult);
  });

  test('string', () => {
    const expectedResult = JSON.stringify('abc');
    const result = stableJsonStringify('abc');

    expect(result).toEqual(expectedResult);
  });

  test('null', () => {
    const expectedResult = JSON.stringify(null);
    const result = stableJsonStringify(null);

    expect(result).toEqual(expectedResult);
  });

  test('buffer', () => {
    const buf = Buffer.from('abc');
    const expectedResult = JSON.stringify(buf);
    const result = stableJsonStringify(buf);

    expect(result).toEqual(expectedResult);
  });

  test('date', () => {
    const date = new Date();
    const expectedResult = JSON.stringify(date);
    const result = stableJsonStringify(date);

    expect(result).toEqual(expectedResult);
  });
});

describe('Passing a single BigInt', () => {
  test('throws an error', () => {
    expect(() => stableJsonStringify(BigInt(42))).toThrow('Cannot serialize a BigInt');
  });
});

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
    const expectedResult = JSON.stringify(obj);
    const result = stableJsonStringify(obj);

    expect(result).toBeDefined();

    if (result !== undefined) {
      expect(JSON.parse(result)).toEqual(JSON.parse(expectedResult));
    }
  });

  test('Array', () => {
    const expectedResult = JSON.stringify(arr);
    const result = stableJsonStringify(arr);

    expect(result).toBeDefined();

    if (result !== undefined) {
      expect(JSON.parse(result)).toEqual(JSON.parse(expectedResult));
    }
  });

  test('Standard object, safe set to false', () => {
    const expectedResult = JSON.stringify(obj);
    const result = stableJsonStringify(obj, null, false);

    expect(result).toBeDefined();

    if (result !== undefined) {
      expect(JSON.parse(result)).toEqual(JSON.parse(expectedResult));
    }
  });

  test('Array, safe set to false', () => {
    const expectedResult = JSON.stringify(arr);
    const result = stableJsonStringify(arr, null, false);

    expect(result).toBeDefined();

    if (result !== undefined) {
      expect(JSON.parse(result)).toEqual(JSON.parse(expectedResult));
    }
  });
});

describe('Stringifying an object with one string value returns the same result as JSON.stringify() when the string includes', () => {
  test('a double quote (")', () => {
    const obj = { a: '"abc"' };

    const expectedResult = JSON.stringify(obj);
    const result = stableJsonStringify(obj);

    expect(result).toEqual(expectedResult);
  });

  test('a backslash (\\)', () => {
    const obj = { a: 'ab\\c' };

    const expectedResult = JSON.stringify(obj);
    const result = stableJsonStringify(obj);

    expect(result).toEqual(expectedResult);
  });

  test('an emoji', () => {
    const obj = { a: '😀' };

    const expectedResult = JSON.stringify(obj);
    const result = stableJsonStringify(obj);

    expect(result).toEqual(expectedResult);
  });
});

describe('Stringifying an object with a BigInt throws an error', () => {
  test('Object', () => {
    const obj = { foo: BigInt(42) };

    expect(() => stableJsonStringify(obj)).toThrow('Cannot serialize objects that contain a BigInt');
  });

  test('Array', () => {
    const arr = [BigInt(42)];

    expect(() => stableJsonStringify(arr)).toThrow('Cannot serialize objects that contain a BigInt');
  });
});

describe('Stringifying an object with a circular reference throws an error', () => {
  test('Object with \'safe\' argument set to true', () => {
    const obj: any = {};

    obj.a = obj;

    expect(() => stableJsonStringify(obj, null, true)).toThrow('Cannot serialize objects that contain a circular reference');
  });

  test('Array with \'safe\' argument set to true', () => {
    const arr: any[] = [];

    arr[0] = arr;

    expect(() => stableJsonStringify(arr, null, true)).toThrow('Cannot serialize objects that contain a circular reference');
  });

  test('Object with \'safe\' argument set to false', () => {
    const obj: any = {};

    obj.a = obj;

    expect(() => stableJsonStringify(obj, null, false)).toThrow('Maximum call stack size exceeded');
  });

  test('Array with \'safe\' argument set to false', () => {
    const arr: any[] = [];

    arr[0] = arr;

    expect(() => stableJsonStringify(arr, null, false)).toThrow('Maximum call stack size exceeded');
  });
});

describe('Correctly sorts object entries before stringifying', () => {
  const obj = {
    c: 1,
    a: 2,
    b: {
      c: 1,
      a: {
        c: {
          c: 1,
          a: 2,
          b: 3
        },
        a: 2,
        b:
        3
      },
      b: 3
    }
  };

  test('with default compare function', () => {
    const expectedResult = '{"a":2,"b":{"a":{"a":2,"b":3,"c":{"a":2,"b":3,"c":1}},"b":3,"c":1},"c":1}';
    const result = stableJsonStringify(obj);

    expect(result).toEqual(expectedResult);
  });

  test('with custom compare function', () => {
    function compareKeys([keyA]: [string, any], [keyB]: [string, any]) {
      return keyB.localeCompare(keyA);
    }

    const expectedResult = '{"c":1,"b":{"c":1,"b":3,"a":{"c":{"c":1,"b":3,"a":2},"b":3,"a":2}},"a":2}';
    const result = stableJsonStringify(obj, compareKeys);

    expect(result).toEqual(expectedResult);
  });
});
