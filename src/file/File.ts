import { Request, Response } from "express";
import Api, { checkApi } from "../Api";
import path from "path";
import mongoose, {Schema, Document} from "mongoose";

export const UPLOAD_DIR: string = "uploads/"

export interface FileApi extends Api {
  name: string;
  stringId: string;
}

export interface FileCell extends Document {
  name: string;
  stringId: string;
  internalFilename: string;
}

const FileSchema: Schema = new Schema({
  name: {type: String, required: true},
  stringId: {type: String, required: true},
  internalFilename: {type: String, required: true}
});

export function checkFile(object: any): boolean {
  return (
    checkApi(object)
    && typeof(object.name) === "string"
    && typeof(object.stringId) === "string"
    && object.type === "file"
  );
}

export function isFile(object: any): object is File {
  return checkFile(object);
}

export class FileHub {
  getAllFiles(): FileApi[] {
    return [
      {
        id: 1,
        type: "file",
        name: "sample",
        stringId: "kjsdkvnosjidfpw"
      }
    ]
  }

  addFile(requestBody: any): FileApi {
    return {
      id: 1,
      type: "file",
      name: "sample",
      stringId: "kjsdkvnosjidfpw"
    }
  } 

  getFile(stringId: string): FileApi {
    return {
      id: 1,
      type: "file",
      name: "sample",
      stringId: "kjsdkvnosjidfpw"
    }
  }

  getFileObjectPath(stringId: string): string {
    return path.join(UPLOAD_DIR, "0afe69f003f208a7c1d7a5a2ea18c416");
  }
}

export class FilesView {
  ROUTE: string = "/files";
  fileHub: FileHub;

  constructor() {
    this.fileHub = new FileHub();
  }

  get(request: any, response: any) {
    response.send(this.fileHub.getAllFiles())
  }

  post(request: any, response: any) {
    response.send(this.fileHub.getFile)
  }
}

export class FilesStringIdView {
  ROUTE: string = "/files/:stringId";
  fileHub: FileHub;

  get(request: any, response: any) {
    response.send({"message": "hello"})
  }
}

export class ShareView {
  ROUTE: string = "/share/:stringId";
  fileHub: FileHub;

  constructor() {
    this.fileHub = new FileHub();
  }

  get(request: Request, response: Response) {
    console.log(request.path);
    response.sendFile(this.fileHub.getFileObjectPath(request.path));
  }
}
