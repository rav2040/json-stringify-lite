// Used to keep a record of seen objects so that circular references can be detected.
export const seenObjects: WeakSet<any> = new WeakSet();
