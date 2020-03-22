import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { stableSerializeObject } from './object-stable';
import { seenObjects } from './seen-objects';

/**
 * Performs the same as stringifyArray() with the single exception that recursive calls to stringifyObject() and
 * stringifyArray() are replaced with calls to stableStringifyObject() and stableStringifyArray() respectively.
 */

export function stableSerializeArray(
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

    if (typeof value === 'string') {
      str += prefix + serializeString(value);
      prefix = ',';
    }

    else if (typeof value === 'number') {
      str += prefix + (value === Infinity || Number.isNaN(value) ? 'null' : value);
      prefix = ',';
    }

    else if (typeof value === 'boolean') {
      str += prefix + value;
      prefix = ',';
    }


    else if (typeof value === 'object' && value !== null) {
      if (Buffer.isBuffer(value)) {
        str += prefix + serializeBuffer(value);
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
            ? stableSerializeArray(value, compareFn, true)
            : stableSerializeObject(value, compareFn, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix;
        str += Array.isArray(value)
          ? stableSerializeArray(value, compareFn, false)
          : stableSerializeObject(value, compareFn, false);
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
