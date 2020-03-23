import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { serializeArray } from './array';
import { serializeObject } from './object';
import { stableSerializeArray } from './array-stable';
import { stableSerializeObject } from './object-stable';

type CompareFunction = (a: string, b: string) => number;

/**
 * Converts the provided object to a JSON string and returns it. If true is passed as the second argument then nested
 * objects will be checked for circular references and an error will be thrown if one is found. If false is passed then
 * there will be no checks for circular references.
 */

export function jsonStringify(value: any, safe = true): string | undefined {
  if (typeof value === 'object') {
    if (value === null) {
      return 'null';
    }

    if (value instanceof Date) {
      return '"' + value.toISOString() + '"';
    }

    if (Buffer.isBuffer(value)) {
      return serializeBuffer(value);
    }

    if (Array.isArray(value)) {
      return serializeArray(value, safe);
    }

    return serializeObject(value, safe);
  }

  else if (typeof value === 'string') {
    return serializeString(value);
  }

  else if (typeof value === 'number') {
    return (value === Infinity || Number.isNaN(value))
      ? 'null'
      : value.toString();
  }

  else if (typeof value === 'boolean') {
    return value.toString();
  }

  else if (typeof value === 'bigint') {
    throw TypeError('Cannot serialize a BigInt');
  }

  return;
}

/**
 * A deterministic version of jsonStringify(). It works the same with the exception that object properties are sorted
 * before being serialized, resulting in consistent output for the same input. By default object keys are sorted
 * alphabetically, but a custom compare function can be passed to control the sorting behavior.
 */

export function stableJsonStringify(value: any, compareFn?: CompareFunction | null, safe = true): string | undefined {
  if (typeof value === 'object') {
    if (value === null) {
      return 'null';
    }

    if (value instanceof Date) {
      return '"' + value.toISOString() + '"';
    }

    if (Buffer.isBuffer(value)) {
      return serializeBuffer(value);
    }

    compareFn = compareFn ?? defaultCompareKeys;

    if (Array.isArray(value)) {
      return stableSerializeArray(value, compareFn, safe);
    }

    return stableSerializeObject(value, compareFn, safe);
  }

  else if (typeof value === 'string') {
    return serializeString(value);
  }

  else if (typeof value === 'number') {
    return (value === Infinity || Number.isNaN(value))
      ? 'null'
      : value.toString();
  }

  else if (typeof value === 'boolean') {
    return value.toString();
  }

  else if (typeof value === 'bigint') {
    throw TypeError('Cannot serialize a BigInt');
  }

  return;
}

function defaultCompareKeys(a: string, b: string) {
  return a > b ? 1 : -1;
}
