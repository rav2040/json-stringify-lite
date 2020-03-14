import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stringifyArray } from './array';
import { seenObjects } from './seen-objects';

/**
 * stringifyObject() iterates over all the key/value pairs of an object, converting them to strings one by one and then
 * concatenating them. The resulting string should match the output of JSON.stringify() with the exception that
 * toJSON() methods are ignored.
 */

export function stringifyObject(obj: any, safe: boolean): string {
  let str = '{';
  let prefix = '"';
  let key;
  let value;

  for (key in obj) {
    value = obj[key];

    if (typeof value === 'boolean') {
      str += prefix + key + '":' + value;
      prefix = ',"';
    }

    else if (typeof value === 'number') {
      str += prefix + key + (value === Infinity || Number.isNaN(value) ? '":null' : '":' + value);
      prefix = ',"';
    }

    else if (typeof value === 'string') {
      str += prefix + key + '":' + stringifyString(value);
      prefix = ',"';
    }

    else if (value === null) {
      str += prefix + key + '":null';
      prefix = ',"';
    }

    else if (typeof value === 'object') {
      if (Buffer.isBuffer(value)) {
        str += prefix + key + '":' + stringifyBuffer(value);
      }

      else if (value instanceof Date) {
        str += prefix + key + '":"' + value.toISOString() + '"';
      }

      else if (safe) {
        if (seenObjects.has(value)) {
          throw Error('Cannot serialize objects that contain a circular reference');
        }

        try {
          seenObjects.add(value);

          str += prefix + key + '":';
          str += Array.isArray(value)
            ? stringifyArray(value, true)
            : stringifyObject(value, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix + key + '":';
        str += Array.isArray(value)
          ? stringifyArray(value, false)
          : stringifyObject(value, false);
      }

      prefix = ',"';
    }

    else if (typeof value === 'bigint') {
      throw TypeError('Cannot serialize objects that contain a BigInt');
    }
  }

  return str + '}';
}
