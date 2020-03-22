/**
 * Converts the provided buffer to the same JSON string that would result if converted with JSON.stringify(). Instead
 * of calling toJSON() and then stringifying the result, the buffer values are concatenated with a pre-prepared string
 * that matches the output of JSON.stringify().
 */

export function serializeBuffer(buf: Buffer): string {
  let str = '{"type":"Buffer","data":[';
  let i;
  let prefix = '';

  for (i = 0; i < buf.length; i++) {
    str += prefix + buf[i];
    prefix = ',';
  }

  return str + ']}';
}
