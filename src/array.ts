import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stringifyObject } from './object';

/**
 * stringifyArray() iterates over all the elements of an array, converting them to strings one by one and then
 * concatenating them. The resulting string should match the output of JSON.stringify() with the exception that any
 * toJSON() methods are ignored.
 */

export function stringifyArray(arr: any[]): string {
  let str = '[';
  let prefix = '';
  let value;

  for (let i = 0; i < arr.length; i++) {
    value = arr[i];

    str += prefix;

    // Only prepend a comma to the element after the first element has been added.
    prefix = ',';

    if (shouldBeNull(value)) {
      str += 'null';
    }

    else if (typeof value === 'string') {
      str += stringifyString(value);
    }

    else if (value instanceof Date) {
      str += '"' + value.toISOString() + '"';
    }

    else if (Buffer.isBuffer(value)) {
      str += stringifyBuffer(value);
    }

    else if (typeof value === 'object') {
      str += Array.isArray(value)
        ? stringifyArray(value)
        : stringifyObject(value);
    }

    else {
      str += value;
    }
  }

  str += ']';

  return str;
}

/**
 * undefined, null, Infinity, NaN, Functions, and Symbols are not valid JSON and should be changed to null if present
 * in an array.
 */

function shouldBeNull(value: any): boolean {
  return (
    value === undefined ||
    value === null ||
    value === Infinity ||
    (typeof value === 'number' && Number.isNaN(value)) ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  );
}
