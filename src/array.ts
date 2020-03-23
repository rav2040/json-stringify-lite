import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { serializeObject } from './object';
import { seenObjects } from './seen-objects';

/**
 * Iterates over all the elements of an array, converting them to strings one by one and then concatenating them. The
 * resulting string should match the output of JSON.stringify() with the exception that toJSON() methods are ignored.
 */

export function serializeArray(arr: any[], safe: boolean): string {
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
            ? serializeArray(value, true)
            : serializeObject(value, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += Array.isArray(value)
          ? serializeArray(value, false)
          : serializeObject(value, false);
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
