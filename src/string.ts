const QUOTATION_MARK = '"';
const BACKSLASH = '\\';

/**
 * Converts a string to a JSON string by escaping any double quote and backslash characters, and then returning the
 * resulting string bookended by double quotes. ASCII control characters and lone surrogate code points are NOT escaped.
 */

export function serializeString(value: string): string {
  let result = QUOTATION_MARK;
  let index;
  let prevIndex = 0;

  let i = value.indexOf(QUOTATION_MARK);
  let j = value.indexOf(BACKSLASH);

  if (i > -1 && j > -1) {
    do {
      if (i < j) {
        index = i;
        i = value.indexOf(QUOTATION_MARK, index + 1);
      }

      else {
        index = j;
        j = value.indexOf(BACKSLASH, index + 1);
      }

      result += value.slice(prevIndex, index) + BACKSLASH;
      prevIndex = index;
    } while (i > -1 && j > -1)
  }

  if (i > -1) {
    do {
      index = i;
      i = value.indexOf(QUOTATION_MARK, index + 1);

      result += value.slice(prevIndex, index) + BACKSLASH;
      prevIndex = index;
    } while (i > -1)
  }

  else if (j > -1) {
    do {
      index = j;
      j = value.indexOf(BACKSLASH, index + 1);

      result += value.slice(prevIndex, index) + BACKSLASH;
      prevIndex = index;
    } while (j > -1)
  }

  return result + value.slice(prevIndex) + QUOTATION_MARK;
}
