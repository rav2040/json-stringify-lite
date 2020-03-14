/**
 * stringifyBuffer() converts the provided buffer to the same JSON string that would result if converted with
 * JSON.stringify(). Instead of calling buf.toJSON() and then stringifying the result, the buffer values are
 * concatenated with a preexisting string that matches what would be returned by JSON.stringify().
 */

export function stringifyBuffer(buf: Buffer): string {
  let str = '{"type":"Buffer","data":[';
  let prefix = '';
  let value;

  for (value of buf) {
    str += prefix + value;
    prefix = ',';
  }

  return str + ']}';
}
