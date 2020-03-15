import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stableStringifyObject } from './object-stable';
import { seenObjects } from './seen-objects';

/**
 * stableStringifyArray() performs the same as stringifyArray() with the single exception that recursive calls to
 * stringifyObject() and stringifyArray() are replaced with calls to stableStringifyObject() and stableStringifyArray()
 * respectively.
 */

export function stableStringifyArray(
  arr: any[],
  compareFn: (a: [string, any], b: [string, any]) => number,
  safe: boolean,
): string {
  let str = '[';
  let prefix = '';
  let i;
  let value;

  for (i = 0; i < arr.length; i++) {
    value = arr[i];

    if (typeof value === 'boolean') {
      str += prefix + value;
      prefix = ',';
    }

    else if (typeof value === 'number') {
      str += prefix + (value === Infinity || Number.isNaN(value) ? 'null' : value);
      prefix = ',';
    }

    else if (typeof value === 'string') {
      str += prefix + stringifyString(value);
      prefix = ',';
    }

    else if (value !== null && typeof value === 'object') {
      if (Buffer.isBuffer(value)) {
        str += prefix + stringifyBuffer(value);
      }

      else if (value instanceof Date) {
        str += prefix + '"' + value.toISOString() + '"';
      }

      else if (safe) {
        if (seenObjects.has(value)) {
          throw Error('Cannot serialize objects that contain a circular reference');
        }

        try {
          seenObjects.add(value);

          str += prefix;
          str += Array.isArray(value)
            ? stableStringifyArray(value, compareFn, true)
            : stableStringifyObject(value, compareFn, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix;
        str += Array.isArray(value)
          ? stableStringifyArray(value, compareFn, false)
          : stableStringifyObject(value, compareFn, false);
      }

      prefix = ',';
    }

    else if (typeof value === 'bigint') {
      throw TypeError('Cannot serialize objects that contain a BigInt');
    }

    else {
      str += prefix + 'null';
      prefix = ',';
    }
  }

  return str + ']';
}
