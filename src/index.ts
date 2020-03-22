import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { serializeArray } from './array';
import { serializeObject } from './object';
import { stableSerializeArray } from './array-stable';
import { stableSerializeObject } from './object-stable';

type CompareFunction = (a: [string, any], b: [string, any]) => number;

/**
 * jsonStringify() converts the provided object to a JSON string and returns it. If true is passed as the second
 * argument then nested objects will be checked for circular references and an error will be thrown if one is found.
 * If false is passed then there will be no checks for circular references, which grants a considerable speed boost.
 */

export function jsonStringify(value: any, safe = true): string | undefined {
  if (typeof value === 'boolean') {
    return value.toString();
  }

  else if (typeof value === 'number') {
    return (value === Infinity || Number.isNaN(value) ? 'null' : value.toString());
  }

  else if (typeof value === 'string') {
    return serializeString(value);
  }

  else if (value === null) {
    return 'null';
  }

  else if (typeof value === 'object') {
    if (Buffer.isBuffer(value)) {
      return serializeBuffer(value);
    }

    else if (value instanceof Date) {
      return '"' + value.toISOString() + '"';
    }

    else {
      return Array.isArray(value)
        ? serializeArray(value, safe)
        : serializeObject(value, safe);
    }
  }

  else if (typeof value === 'bigint') {
    throw TypeError('Cannot serialize a BigInt');
  }

  return;
}

/**
 * stableJsonStringify() is a deterministic version of jsonStringify(). It works the same with the exception that object
 * properties are sorted before being serialized, resulting in consistent output for the same input. By default object
 * keys are sorted alphabetically, but a custom compare function can be passed to control the sorting behavior.
 */

export function stableJsonStringify(value: any, compareFn?: CompareFunction | null, safe = true): string | undefined {
  if (typeof value === 'boolean') {
    return value.toString();
  }

  else if (typeof value === 'number') {
    return (value === Infinity || Number.isNaN(value) ? 'null' : value.toString());
  }

  else if (typeof value === 'string') {
    return serializeString(value);
  }

  else if (value === null) {
    return 'null';
  }

  else if (typeof value === 'object') {
    if (Buffer.isBuffer(value)) {
      return serializeBuffer(value);
    }

    else if (value instanceof Date) {
      return '"' + value.toISOString() + '"';
    }

    else {
      compareFn = typeof compareFn === 'function' ? compareFn : defaultCompareKeys;

      return Array.isArray(value)
        ? stableSerializeArray(value, compareFn, safe)
        : stableSerializeObject(value, compareFn, safe);
    }
  }

  else if (typeof value === 'bigint') {
    throw TypeError('Cannot serialize a BigInt');
  }

  return;
}

function defaultCompareKeys([keyA]: string[], [keyB]: string[]) {
  return keyA > keyB ? 1 : -1;
}
