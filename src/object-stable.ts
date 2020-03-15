import { stringifyString } from './string';
import { stringifyBuffer } from './buffer';
import { stableStringifyArray } from './array-stable';
import { seenObjects } from './seen-objects';

/**
 * stableStringifyObject() performs the same as stringifyObject(), except that object entries are sorted using the
 * provided compare function before being serialized. Also, recursive calls to stringifyObject() and stringifyArray()
 * are replaced with calls to stableStringifyObject() and stableStringifyArray() respectively.
 */

export function stableStringifyObject(
  obj: any,
  compareFn: (a: [string, any], b: [string, any]) => number,
  safe: boolean
): string {
  const entries = Object.entries(obj).sort(compareFn);

  let str = '{';
  let prefix = '"';
  let i;
  let key;
  let value;

  for (i = 0; i < entries.length; i++) {
    [key, value] = entries[i];

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
            ? stableStringifyArray(value, compareFn, true)
            : stableStringifyObject(value, compareFn, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += prefix + key + '":';
        str += Array.isArray(value)
          ? stableStringifyArray(value, compareFn, false)
          : stableStringifyObject(value, compareFn, false);
      }

      prefix = ',"';
    }

    else if (typeof value === 'bigint') {
      throw TypeError('Cannot serialize objects that contain a BigInt');
    }
  }

  return str + '}';
}
