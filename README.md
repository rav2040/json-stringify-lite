# TuftJS: JSON Stringify

![Node.js CI](https://github.com/tuftjs/json-stringify/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/tuftjs/json-stringify/badge.svg)](https://coveralls.io/github/tuftjs/json-stringify)
[![Known Vulnerabilities](https://snyk.io/test/github/tuftjs/json-stringify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tuftjs/json-stringify?targetFile=package.json)

A more performant version of `JSON.stringify()` for Node.js. Strings produced by this function should match the output of `JSON.stringify()` with the exception that `toJSON()` methods are completely ignored. `Buffer` values will be transformed to represent the same output you would get from `JSON.stringify()`.

## Installation
```bash
npm i @tuft/json-stringify
```

## Usage
```js
const jsonStringify = require('@tuft/json-stringify');

const obj = {
  hello: 'world',
};

jsonStringify(obj);  // '{"hello":"world"}'
```
