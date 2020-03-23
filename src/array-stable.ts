import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { stableSerializeObject } from './object-stable';
import { seenObjects } from './seen-objects';

type CompareFunction = (a: string, b: string) => number;

/**
 * Performs the same as stringifyArray() with the single exception that recursive calls to stringifyObject() and
 * stringifyArray() are replaced with calls to stableStringifyObject() and stableStringifyArray() respectively.
 */

export function stableSerializeArray(arr: any[], compareFn: CompareFunction, safe: boolean): string {
  let str = '[';
  let prefix = '';
  let i;
  let value;

  for (i = 0; i < arr.length; i++) {
    value = arr[i];
    str += prefix;

    if (typeof value === 'object' && value !== null) {
      if (value instanceof Date) {
        str += '"' + value.toISOString() + '"';
      }

      else if (Buffer.isBuffer(value)) {
        str += serializeBuffer(value);
      }

      else if (safe) {
        if (seenObjects.has(value)) {
          throw Error('Cannot serialize objects that contain a circular reference');
        }

        try {
          seenObjects.add(value);

          str += Array.isArray(value)
            ? stableSerializeArray(value, compareFn, true)
            : stableSerializeObject(value, compareFn, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += Array.isArray(value)
          ? stableSerializeArray(value, compareFn, false)
          : stableSerializeObject(value, compareFn, false);
      }
    }

    else if (typeof value === 'string') {
      str += serializeString(value);
    }

    else if (typeof value === 'number') {
      str += value === Infinity || Number.isNaN(value)
        ? 'null'
        : value;
    }

    else if (typeof value === 'boolean') {
      str += value;
    }

    else if (typeof value === 'bigint') {
      throw TypeError('Cannot serialize objects that contain a BigInt');
    }

    else {
      str += 'null';
    }

    prefix = ',';
  }

  return str + ']';
}
