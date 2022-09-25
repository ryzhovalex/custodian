import { Request, Response } from "express";
import path from "path";
import mongoose, {Schema, Document} from "mongoose";
import ApiModel from "../ApiModel";
import getAppDir from "../tools/getAppDir";
import { nextTick } from "process";

export const UPLOAD_DIR: string = "/home/alex/projects/custodian/uploads";

export interface File extends ApiModel {
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
    typeof(object.name) === "string"
    && typeof(object.stringId) === "string"
    && object.type === "file"
  );
}

export function isFile(object: any): object is File {
  return checkFile(object);
}

/**
 * File data after multipart parsing and saving stage.
 */
export interface MultipartParsedFile {
  name: string;
  internalFilename: string;
}

export class FileHub {
  constructor() {}

  getAllFiles(): {files: File[]} {
    return {
      files: [
        {
          id: 1,
          type: "file",
          name: "sample",
          stringId: "kjsdkvnosjidfpw"
        }
      ]
    }
  }

  /**
   * Adds a file.
   * 
   * File data is generally parsed by multipart parser, here formatted data
   * according should be sent. 
   */
  addFile(multipartParsedFile: MultipartParsedFile): File {
    /**
     * TODO:
     * Add special handling for internal file name "sample" for test purposes
     */
    return {
      id: 1,
      type: "file",
      name: "sample",
      stringId: "kjsdkvnosjidfpw"
    }
  } 

  getFile(stringId: string): File {
    return {
      id: 1,
      type: "file",
      name: "sample",
      stringId: "kjsdkvnosjidfpw"
    }
  }

  getFileObjectPath(stringId: string): string {
    return path.join(
      UPLOAD_DIR, "sample.jpg"
    );
  }
}

export class FilesView {
  ROUTE: string = "/files";

  get(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    response.send(fileHub.getAllFiles());
  }

  post(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    response.send(fileHub.getFile("sample"));
  }
}

export class FilesStringIdView {
  ROUTE: string = "/files/:stringId";

  get(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    response.send(fileHub.getFile("sample"));
  }
}

export class ShareView {
  ROUTE: string = "/share/:stringId";

  get(request: Request, response: Response) {
    let fileHub: FileHub = new FileHub();
    let fileObjectPath: string = fileHub.getFileObjectPath(
      request.params.stringId
    );

    response.sendFile(
      fileObjectPath,
      (error: any) => {
        if (error) {
          console.log(error);
          response.send(error);
        } else {
          console.log("[ShareView] File sent", fileObjectPath);
        }
      });
  }
}
