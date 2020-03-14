# TuftJS: JSON Stringify

![Node.js CI](https://github.com/tuftjs/json-stringify/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/json-stringify/badge.svg)](https://coveralls.io/github/tuftjs/json-stringify)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/json-stringify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/json-stringify?targetFile=package.json)

A more performant version of `JSON.stringify()` for Node.js. Strings produced by this function should match the output of `JSON.stringify()` with the exception that `toJSON()` methods are completely ignored. `Buffer` and `Date` values will be transformed to represent the same output you would get from `JSON.stringify()`.

⚠ **Important note:**  
By default a check will be made on all nested objects and arrays for circular references, and an `Error` will be thrown if one is encountered. Setting the second argument to `false` will disable this check and grant a considerable speed boost, but this should not be done unless it is certain the given object contains no circular references.

## Installation

```bash
npm i @tuft/json-stringify
```

## Syntax

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

## Exceptions

❌ Throws an `Error` if an object contains a circular reference and 'safe' is set to `true`.  
❌ Throws a `TypeError` if an object contains a `BigInt`.  

## Usage

```js
const { jsonStringify } = require('@tuft/json-stringify');

const obj = {
  foo: 42,
  hello: 'world',
};

jsonStringify(obj);  // '{"foo":42,"hello":"world"}'
```
