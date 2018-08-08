export function valueAt(o: any, key: string) {
  const arr = key.split('.');
  let obj = Object.assign({}, o);

  for (let i = 0; i < arr.length - 1; i++) {
    obj = obj[arr[i]];
  }

  return obj[arr[arr.length - 1]];
}

export function equal(elements: Array<string | number>) {
  return !!elements.reduce((a: any, b: any) => (a === b) ? a : NaN);
}
