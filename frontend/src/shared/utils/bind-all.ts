export function bindAll<T extends object>(obj: T): void {
  const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
    .filter(name => typeof (obj as any)[name] === 'function' && name !== 'constructor');

  for (const name of methodNames) {
    (obj as any)[name] = (obj as any)[name].bind(obj);
  }
}