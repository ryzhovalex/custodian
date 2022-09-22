export default interface File {
  name: string,
  stringId: string
}

export function isFile(object: any): object is File {
  return "name" in object;
}
