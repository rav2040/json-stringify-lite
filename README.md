# TuftJS: JSON Stringify

![Node.js CI](https://github.com/tuftjs/json-stringify/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/json-stringify/badge.svg?branch=master)](https://coveralls.io/github/tuftjs/json-stringify?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/json-stringify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/json-stringify?targetFile=package.json)

A JSON library for Node.js that exports the following functions:
* [jsonStringify()](#jsonstringify)
* [stableJsonStringify()](#stablejsonstringify)

## Installation

```bash
npm i @tuft/json-stringify
```

</br>
<p align="center">
  🔹 🔹 🔹
</p>

## jsonStringify()

A more performant version of `JSON.stringify()`. Strings produced by this function should be comparable to the output of `JSON.stringify()` with the following exceptions:
* There are no 'replacer' or 'space' parameters.
* `toJSON()` methods are completely ignored. However, `Buffer` and `Date` values will be transformed to represent the same output you would get from `JSON.stringify()`.

⚠ **Important note:**  
By default a check will be made on all nested objects and arrays for circular references, and an `Error` will be thrown if one is encountered. Setting the second argument to `false` will disable this check and grant a considerable speed boost, but this should not be done unless it is certain the given object contains no circular references.

#### Syntax

```ts
jsonStringify(value: any, safe?: boolean): string
```

#### Parameters

>***value***  
>The value to convert to a JSON string.
>
>***safe** (optional)*  
>A `boolean` to indicate how circular references should be handled. If `true` then an `Error` will be thrown when a circular reference is encountered, otherwise no checks for circular references will be made. Defaults to `true`.  

#### Return value

>A JSON string that represents the provided value.

#### Exceptions

* Throws an `Error` if an object contains a circular reference and 'safe' is set to `true`.
* Throws a `TypeError` if an object contains a `BigInt`.

```js
const { jsonStringify } = require('@tuft/json-stringify');

const obj = {
  foo: 42,
  hello: 'world',
};

jsonStringify(obj);  // '{"foo":42,"hello":"world"}'
```

</br>
<p align="center">
  🔹 🔹 🔹
</p>

## stableJsonStringify()

A deterministic version of `jsonStringify()`. It performs the same as `jsonStringify()` with the exception that object entries are sorted before being serialized. This ensures that consistent output is produced for the same input.

#### Syntax

```ts
stableJsonStringify(value: any, compareFunction?: (a: T, b: T) => number, safe?: boolean): string
```

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

* Throws an `Error` if an object contains a circular reference and 'safe' is set to `true`.
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

If a comparison function is provided, it works the same as JavaScript's `Array.prototype.sort()` method. The two arguments, 'a' and 'b', represent two successive key/value pairs in the form of `[key, value]`. A number is returned to indicate sort order as follows:
* If a number less than zero is returned, *a* will precede *b*.
* If a number greater than zero is returned, *b* will precede *a*.
* If zero is returned, the original order will be maintained.

```js
const { stableJsonStringify } = require('@tuft/json-stringify');

// Sorts keys in descending alphabetical order.
function compareFunction(entryA, entryB) {
  const [keyA] = entryA;
  const [keyB] = entryB;

  return keyB.localeCompare(keyA);
}

const obj = {
  b: 'foo',
  c: 'bar',
  a: 'baz',
};

stableJsonStringify(obj);  // '{"c":"bar","b":"foo","a":"baz"}'
```

</br>
<p align="center">
  🔹 🔹 🔹
</p>
