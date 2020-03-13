import { stringifyArray } from './array';
import { stringifyObject } from './object';

function jsonStringify(value: { [key: string]: any } | any[]): string {
  return Array.isArray(value) ? stringifyArray(value) : stringifyObject(value);
}

export = jsonStringify;
