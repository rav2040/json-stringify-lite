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
            ? serializeArray(value, true)
            : serializeObject(value, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix;
        str += Array.isArray(value)
          ? serializeArray(value, false)
          : serializeObject(value, false);
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
