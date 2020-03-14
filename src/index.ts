import { stringifyArray } from './array';
import { stringifyObject } from './object';

/**
 * jsonStringify() converts the provided object to a JSON string and returns it. If true is passed as the second
 * argument then nested objects will be checked for circular references and an error will be thrown if one is found.
 * If false is passed then there will be no checks for circular references, which grants a considerable speed boost.
 */

export function jsonStringify(value: { [key: string]: any } | any[], safe = true): string {
  return Array.isArray(value)
    ? stringifyArray(value, safe)
    : stringifyObject(value, safe);
}
