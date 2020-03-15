// A map of strings that can be directly substituted for any code points that need to be escaped.
const escapeStrings: { [key: number]: string } = {
  34: '\\"',
  92: '\\\\',
};

// Generate UTF-16 hex values for ASCII control characters by converting numbers 0 to 31 to hex values.
for (let i = 0; i < 32; i++) {
  escapeStrings[i] = '\\u00' + i.toString(16);
}


// Generate UTF-16 hex values for surrogate code points by converting numbers 55,296 to 57,343 to hex values.
for (let i = 55_296; i < 57_344; i++) {
  escapeStrings[i] = '\\u' + i.toString(16);
}

/**
 * stringifyString() converts a string to a JSON string by escaping any ASCII control characters and lone UTF-16
 * surrogate code points, as well as the double quote and backslash characters, and then returning the resulting string
 * bookended by double quote characters. Control characters and lone surrogate code points are converted to UTF-16 hex
 * values before being escaped. Double quote and backslash characters are simply escaped with a backslash.
 */

export function stringifyString(value: string): string {
  let str = '"';
  let i;
  let j;
  let charCode;
  let nextCharCode;

  for (i = 0, j = 0; i < value.length; i++) {
    charCode = value.charCodeAt(i);

    if (charCode < 32 || charCode === 34 || charCode === 92) {
      // The current character is a control character, double quote, or backslash.
      str += value.slice(j, i) + escapeStrings[charCode];
      j = i + 1;
    }

    else if (charCode >= 0xD800 && charCode <= 0xDFFF) {
      // The current character is a surrogate.
      if (charCode <= 0xDBFF) {
        // The current character is a leading surrogate.
        nextCharCode = value.charCodeAt(i + 1);

        if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
          // The next character is a trailing surrogate, so skip the next iteration.
          i++;
        }

        else {
          // The current character is a lone leading surrogate.
          str += value.slice(j, i) + escapeStrings[charCode];
          j = i + 1;
        }
      }

      else {
        // The current character is a lone trailing surrogate.
        str += value.slice(j, i) + escapeStrings[charCode];
        j = i + 1;
      }
    }
  }

  // If j is 0 then the string was not altered, so the original string value can be used.
  str += j === 0 ? value : value.slice(j);

  return str + '"';
}
