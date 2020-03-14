import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stringifyObject } from './object';
import { seenObjects } from './seen-objects';

/**
 * stringifyArray() iterates over all the elements of an array, converting them to strings one by one and then
 * concatenating them. The resulting string should match the output of JSON.stringify() with the exception that
 * toJSON() methods are ignored.
 */

export function stringifyArray(arr: any[], safe: boolean): string {
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
          throw Error('Cannot stringify objects with a circular reference');
        }

        try {
          seenObjects.add(value);

          str += prefix;
          str += Array.isArray(value)
            ? stringifyArray(value, true)
            : stringifyObject(value, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix;
        str += Array.isArray(value)
          ? stringifyArray(value, false)
          : stringifyObject(value, false);
      }

      prefix = ',';
    }

    else {
      str += prefix + 'null';
      prefix = ',';
    }
  }

  return str + ']';
}
