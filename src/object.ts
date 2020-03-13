import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stringifyArray } from './array';

/**
 * stringifyObject() iterates over all the key/value pairs of an object, converting them to strings one by one and then
 * concatenating them. The resulting string should match the output of JSON.stringify() with the exception that any
 * toJSON() methods are ignored.
 */

export function stringifyObject(obj: any): string {
  let str = '{';
  let prefix = '"';
  let key;
  let value;

  for (key in obj) {
    value = obj[key];

    if (shouldBeOmitted(value)) {
      continue;
    }

    str += prefix + key + '":';

    // Only prepend a comma to the key string after the first key has been added.
    prefix = ',"';

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

  return str + '}';
}


/**
 * null, Infinity, and NaN are not valid JSON and should be changed to null if present in an object.
 */

function shouldBeNull(value: any): boolean {
  return (
    value === null ||
    value === Infinity ||
    (typeof value === 'number' && Number.isNaN(value))
  );
}


/**
 * undefined, Functions, and Symbols are not valid JSON and should be omitted if present in an object.
 */

function shouldBeOmitted(value: any): boolean {
  return (
    value === undefined ||
    typeof value === 'function' ||
    typeof value === 'symbol'
  );
}
