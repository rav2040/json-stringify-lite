import { serializeString } from './string';
import { serializeBuffer } from './buffer';
import { stableSerializeArray } from './array-stable';
import { seenObjects } from './seen-objects';

type CompareFunction = (a: string, b: string) => number;

/**
 * Performs the same function as stringifyObject(), except that object entries are sorted using the
 * provided comparison function before being serialized.
 */

export function stableSerializeObject(obj: { [key: string]: any }, compareFn: CompareFunction, safe: boolean): string {
  const keys = Object.keys(obj).sort(compareFn);

  let str = '{';
  let prefix = '"';
  let i;
  let key;
  let value;

  for (i = 0; i < keys.length; i++) {
    key = keys[i];
    value = obj[key];

    if (typeof value === 'object') {
      str += prefix + key;

      if (value === null) {
        str += '":null';
      }

      else if (value instanceof Date) {
        str += '":"' + value.toISOString() + '"';
      }

      else if (Buffer.isBuffer(value)) {
        str += '":' + serializeBuffer(value);
      }

      else if (safe) {
        if (seenObjects.has(value)) {
          throw Error('Cannot serialize objects that contain a circular reference');
        }

        try {
          seenObjects.add(value);

          str += '":';
          str += Array.isArray(value)
            ? stableSerializeArray(value, compareFn, true)
            : stableSerializeObject(value, compareFn, true);
        }

        finally {
          seenObjects.delete(value);
        }
      }

      else {
        str += '":';
        str += Array.isArray(value)
          ? stableSerializeArray(value, compareFn, true)
          : stableSerializeObject(value, compareFn, false);
      }

      prefix = ',"';
    }

    else if (typeof value === 'string') {
      str += prefix + key + '":' + serializeString(value);
      prefix = ',"';
    }

    else if (typeof value === 'number') {
      str += prefix + key;
      str += value === Infinity || Number.isNaN(value)
        ? '":null'
        : ('":' + value);
      prefix = ',"';
    }

    else if (typeof value === 'boolean') {
      str += prefix + key + '":' + value;
      prefix = ',"';
    }

    else if (typeof value === 'bigint') {
      throw TypeError('Cannot serialize objects that contain a BigInt');
    }
  }

  return str + '}';
}
