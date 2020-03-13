const escapeStrings: { [key: number]: string } = {
  34: '\\"',
  92: '\\\\',
};

// Generate double-byte hex values by converting numbers 0-31 to hex values and appending them to 'u00'.
for (let i = 0; i < 32; i++) {
  escapeStrings[i] = '\\u00' + i.toString(16);
}

/**
 * stringifyString() converts a string to a JSON string by escaping any ASCII control characters, as well as the
 * double-quote and backslash characters, and then returning the resulting string bookended by double-quote characters.
 * Control characters (ASCII codes 0-31) are converted to double-byte surrogate pair hex values before being escaped.
 * Double-quote (ASCII code 34) and backslash (ASCII code 92) characters are simply escaped with a backslash.
 */

export function stringifyString(value: string): string {
  let str = '"';
  let i;
  let j;
  let charCode;

  for (i = 0, j = 0; i < value.length; i++) {
    charCode = value.charCodeAt(i);

    if (charCode < 32 || charCode === 34 || charCode === 92) {
      str += value.slice(j, i) + escapeStrings[charCode];
      j = i + 1;
    }
  }

  // If j is 0 then the string was not altered and the original value can be added directly.
  str += j === 0 ? value : value.slice(j);

  return str + '"';
}
