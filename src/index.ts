import { stringifyArray } from './array';
import { stringifyObject } from './object';
import { stableStringifyArray } from './array-stable';
import { stableStringifyObject } from './object-stable';

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

/**
 * stableJsonStringify() is a deterministic version of jsonStringify(). It works the same with the exception that object
 * properties are sorted before being serialized, resulting in consistent output for the same input. By default object
 * keys are sorted alphabetically, but a custom compare function can be passed to control the sorting behavior.
 */

export function stableJsonStringify(
  value: { [key: string]: any } | any[],
  compareFn: (a: [string, any], b: [string, any]) => number = defaultCompareKeys,
  safe = true,
): string {
  return Array.isArray(value)
    ? stableStringifyArray(value, compareFn, safe)
    : stableStringifyObject(value, compareFn, safe);
}

function defaultCompareKeys([keyA]: [string, any], [keyB]: [string, any]) {
  return keyA.localeCompare(keyB);
}
