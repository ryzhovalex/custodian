export default interface File extends Model {
  name: string,
  stringId: string
}

export function isFile(object: any): boolean {
  return (
    isModel(object)
    && typeof(object.name) === "string"
    && typeof(object.stringId) === "string"
    && object.type === "file"
  );
}

export function isFileGuard(object: any): object is File {
  return isFile(object);
}
