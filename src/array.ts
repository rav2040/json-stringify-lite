import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stringifyObject } from './object';

/**
 * stringifyArray() iterates over all the elements of an array, converting them to strings one by one and then
 * concatenating them. The resulting string should match the output of JSON.stringify() with the exception that
 * toJSON() methods are ignored.
 */

export function stringifyArray(arr: any[]): string {
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

      else {
        str += prefix + (Array.isArray(value) ? stringifyArray(value) : stringifyObject(value));
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
