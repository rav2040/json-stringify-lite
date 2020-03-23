# TuftJS: JSON Stringify

![Node.js CI](https://github.com/tuftjs/json-stringify/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/json-stringify/badge.svg?branch=master)](https://coveralls.io/github/tuftjs/json-stringify?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/json-stringify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/json-stringify?targetFile=package.json)

A JSON library for Node.js that exports the following set of functions:

* [jsonStringify()](#jsonstringifyvalue-safe)
* [stableJsonStringify()](#stablejsonstringifyvalue-comparefunction-safe)

These functions prioritize performance at the expense of certain features. The serialized JSON output of these functions is identical to that of `JSON.stringify()` with the following exceptions:

1. When serializing strings, only quotation marks (`"`) and backslashes (`\`) are escaped. As the vast majority of strings in real world usage do not include ASCII control characters or lone surrogate code points, a significant performance boost is gained by not checking for their presence. If you require this functionality, it is best to stick with `JSON.stringify()` or another alternative.
2. `toJSON()` methods are completely ignored. However, `Buffer` and `Date` objects *will* be transformed to represent the same output you would get from `JSON.stringify()`.

These functions also do not have *replacer* or *space* parameters like `JSON.stringify()` does.

⚠ **Note:**  
By default, a check will be made on all nested objects and arrays for circular references, and an `Error` will be thrown if one is encountered. Setting the *safe* parameter to `false` will disable this check and grant a considerable speed boost. If a circular reference is found when *safe* is set to `false`, the internal serialization function will be called recursively until the call stack size is exceeded.

## Installation

```bash
npm i @tuft/json-stringify
```

## API

### jsonStringify(*value*[, *safe*])

Converts a JavaScript object or value to a JSON string. The following are valid data types that can be converted to JSON:

* `null`
* Boolean
* Number
* String
* Array
* Object
* `Date`**
* `Buffer`**

\*\* `Date` and `Buffer` objects are serialized in a way that matches the output of their respective `toJSON()` methods.

#### Parameters

>***value***  
>The value to convert to a JSON string.
>
>***safe** (optional)*  
>A `boolean` to indicate how circular references should be handled. If `true` then an `Error` will be thrown when a circular reference is encountered, otherwise no checks for circular references will be made. Defaults to `true`.  

#### Return value

>A JSON string that represents the provided value.

#### Exceptions

* Throws an `Error` if an object contains a circular reference and *safe* is set to `true`.
* Throws a `TypeError` if an object contains a `BigInt`.

```js
const { jsonStringify } = require('@tuft/json-stringify');

const obj = {
  foo: 42,
  hello: 'world',
};

jsonStringify(obj);  // '{"foo":42,"hello":"world"}'
```

### stableJsonStringify(*value*,[ *compareFunction*[, *safe*]])

A deterministic version of `jsonStringify()`. It performs the same, with the exception that object entries are sorted before being serialized. This ensures that consistent output is produced for the same input, at the cost of reduced performance.

#### Parameters

>***value***  
>The value to convert to a JSON string.
>
>***compareFunction** (optional)*  
>A `Function` to determine how object entries are sorted. By default object keys are sorted alphabetically (A-Z).
>
>***safe** (optional)*  
>A `boolean` to indicate how circular references should be handled. If `true` then an `Error` will be thrown when a circular reference is encountered, otherwise no checks for circular references will be made. Defaults to `true`.  

#### Return value

>A JSON string that represents the provided value.

#### Exceptions

* Throws an `Error` if an object contains a circular reference and *safe* is set to `true`.
* Throws a `TypeError` if an object contains a `BigInt`.

```js
const { stableJsonStringify } = require('@tuft/json-stringify');

const obj = {
  b: 'foo',
  c: 'bar',
  a: 'baz',
};

stableJsonStringify(obj);  // '{"a":"baz","b":"foo","c":"bar"}'
```

#### Using a comparison function

If a comparison function is provided, it works the same as JavaScript's `Array.prototype.sort()` method. The two arguments, *a* and *b*, represent two successive object keys. A number is returned to indicate sort order as follows:
* If a number less than `0` is returned, *a* will precede *b*.
* If a number greater than `0` is returned, *b* will precede *a*.
* If `0` is returned, the original order will be maintained.

```js
const { stableJsonStringify } = require('@tuft/json-stringify');

// Sorts keys in descending alphabetical order.
function compareFunction(keyA, keyB) {
  return keyA < keyB ? 1 : -1;
}

const obj = {
  b: 'foo',
  c: 'bar',
  a: 'baz',
};

stableJsonStringify(obj);  // '{"c":"bar","b":"foo","a":"baz"}'
```
