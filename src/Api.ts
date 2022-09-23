export default interface Api {
  id: number;
  type: string;
}

export function checkApi(object: any): boolean {
  return (
    object
    && typeof(object.id) === "number"
    && typeof(object.type) === "string"
  )
}
