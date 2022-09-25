export default interface ApiModel {
  id: string;
  type: string;
}

export function checkApiModel(object: any): boolean {
  return (
    object
    && typeof(object.id) === "string"
    && typeof(object.type) === "string"
  )
}
