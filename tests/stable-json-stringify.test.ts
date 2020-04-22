import { stableJsonStringify } from '../src/index';

describe('Serializing', () => {
  test('undefined returns undefined', () => {
    const output = stableJsonStringify(undefined);
    expect(output).toEqual(undefined);
  });

  test('null returns \'null\'', () => {
    const output = stableJsonStringify(null);
    expect(output).toEqual('null');
  });

  test('true (boolean) returns \'true\'', () => {
    const output = stableJsonStringify(true);
    expect(output).toEqual('true');
  });

  test('42 (number) returns \'42\'', () => {
    const output = stableJsonStringify(42);
    expect(output).toEqual('42');
  });

  test('Infinity (number) returns \'null\'', () => {
    const output = stableJsonStringify(Infinity);
    expect(output).toEqual('null');
  });

  test('NaN (number) returns \'null\'', () => {
    const output = stableJsonStringify(NaN);
    expect(output).toEqual('null');
  });

  test('abc (string) returns "abc"', () => {
    const output = stableJsonStringify('abc');
    expect(output).toEqual('"abc"');
  });

  test('a buffer returns the same output as JSON.stringify()', () => {
    const value = Buffer.from('abc');
    const expectedOutput = JSON.stringify(value);
    const output = stableJsonStringify(value);
    expect(output).toEqual(expectedOutput);
  });

  test('a date returns the same output as JSON.stringify()', () => {
    const value = new Date();
    const expectedOutput = JSON.stringify(value);
    const output = stableJsonStringify(value);
    expect(output).toEqual(expectedOutput);
  });
});

describe('Passing a single BigInt', () => {
  test('throws an error', () => {
    const value = BigInt(42);
    expect(() => stableJsonStringify(value)).toThrow('Cannot serialize a BigInt');
  });
});

describe('Output that can be parsed with JSON.parse() is returned when serializing', () => {
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
    k: Symbol(),
    l: () => {},
    m: new Map(),
    n: {
      nestedObject: {
        a: true,
      },
      nestedArray: [
        true,
      ],
    },
    o: [
      {
        a: true,
      },
      [
        true,
      ],
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
    Symbol(),
    () => {},
    new Map(),
    {
      nestedObject: {
        a: true,
      },
      nestedArray: [
        true,
      ],
    },
    [
      {
        a: true,
      },
      [
        true,
      ],
    ],
  ];

  test('an object', () => {
    const output = stableJsonStringify(obj);
    expect(output).toBeDefined();
    expect(() => JSON.parse(output!)).not.toThrowError();
  });

  test('an array', () => {
    const output = stableJsonStringify(arr);
    expect(output).toBeDefined();
    expect(() => JSON.parse(output!)).not.toThrowError();
  });

  test('an object with \'safe\' argument set to false', () => {
    const output = stableJsonStringify(obj, null, false);
    expect(output).toBeDefined();
    expect(() => JSON.parse(output!)).not.toThrowError();
  });

  test('an array with \'safe\' argument set to false', () => {
    const output = stableJsonStringify(arr, null, false);
    expect(output).toBeDefined();
    expect(() => JSON.parse(output!)).not.toThrowError();
  });
});

describe('An error is thrown when serializing a BigInt inside', () => {
  test('an object', () => {
    const value = { foo: BigInt(42) };
    expect(() => stableJsonStringify(value)).toThrow('Cannot serialize objects that contain a BigInt');
  });

  test('an array', () => {
    const value = [BigInt(42)];
    expect(() => stableJsonStringify(value)).toThrow('Cannot serialize objects that contain a BigInt');
  });
});

describe('Serializing an object with a circular reference throws an error', () => {
  test('object with \'safe\' argument set to true', () => {
    const value: any = {};
    value.a = value;
    expect(() => stableJsonStringify(value, null, true)).toThrow('Cannot serialize objects that contain a circular reference');
  });

  test('array with \'safe\' argument set to true', () => {
    const value: any[] = [];
    value[0] = value;
    expect(() => stableJsonStringify(value, null, true)).toThrow('Cannot serialize objects that contain a circular reference');
  });

  test('object with \'safe\' argument set to false', () => {
    const value: any = {};
    value.a = value;
    expect(() => stableJsonStringify(value, null, false)).toThrow('Maximum call stack size exceeded');
  });

  test('array with \'safe\' argument set to false', () => {
    const value: any[] = [];
    value[0] = value;
    expect(() => stableJsonStringify(value, null, false)).toThrow('Maximum call stack size exceeded');
  });
});

describe('Property names are correctly sorted when serializing an object', () => {
  test('with the default compare function', () => {
    const expectedOutput = '{"a":2,"b":3,"c":1}';
    const output = stableJsonStringify({ c: 1, a: 2, b: 3 });
    expect(output).toEqual(expectedOutput);
  });

  test('with a custom compare function', () => {
    const compareFn = (a: string, b: string) => b.localeCompare(a);
    const expectedOutput = '{"c":1,"b":3,"a":2}';
    const output = stableJsonStringify({ c: 1, a: 2, b: 3 }, compareFn);
    expect(output).toEqual(expectedOutput);
  });
});
