import { Request, Response } from "express";
import path from "path";
import mongoose, {Schema, Document, ObjectId} from "mongoose";
import ApiModel, { checkApiModel } from "../ApiModel";
import getAppDir from "../tools/getAppDir";
import { nextTick } from "process";
import { userInfo } from "os";

export const UPLOAD_DIR: string =
  process.env.CUSTODIAN_UPLOAD_DIR || path.join(__dirname, "uploads");

export interface File extends ApiModel {
  name: string;
}

export interface FileDocument extends Document {
  type: string;
  name: string;
  internalFilename: string;
}

const FileSchema: Schema = new Schema({
  type: {type: String, required: true},
  name: {type: String, required: true},
  internalFilename: {type: String, required: true}
});

export const FileMapping = mongoose.model("File", FileSchema);

export function checkFile(object: any): boolean {
  return (
    checkApiModel(object)
    && typeof(object.name) === "string"
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

  async getAllFiles(): Promise<{files: File[]}> {
    return FileMapping.find({})
      .then((documents) => {
        let files: File[] = [];

        for (let fileDocument of documents) {
          files.push(this.parseFile(fileDocument));
        }

        return {
          files: files
        }
      }); 
  }

  /**
   * Adds a file.
   * 
   * File data is generally parsed by multipart parser, here formatted data
   * according should be sent. 
   */
  async addFile(multipartParsedFile: MultipartParsedFile): Promise<File> {
    return FileMapping.create({
      type: "file",
      name: multipartParsedFile.name,
      internalFilename: multipartParsedFile.internalFilename
    })
      .then((data) => {
        return this.parseFile(data);
      })
      .catch((error: Error) => {
        throw error;
      });
  } 

  async getFile(id: string): Promise<File> {
    return this.getFileDocument(id)
      .then((document) => {
        return this.parseFile(document);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  protected async getFileDocument(id: string): Promise<any> {
    let doc = FileMapping.findOne({ id: id });
    if (doc !== null) {
      return doc;
    } else {
      throw Error(`No document with id ${id}`);
    }
  }

  async getFileObjectPath(id: string): Promise<string> {
    return this.getFileDocument(id)
      .then((document: any) => {
        return path.join(UPLOAD_DIR, document.internalFilename);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  protected parseFile(document: any): File {
    return {
      id: document._id.toString(),
      type: document.type,
      name: document.name
    }
  }
}

export class FilesView {
  ROUTE: string = "/files";

  async get(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    response.json(await fileHub.getAllFiles());
  }

  async post(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    let file: File = await fileHub.getFile(request.params.id);
    response.json(file);
  }
}

export class FilesStringIdView {
  ROUTE: string = "/files/:id";

  async get(request: any, response: any) {
    let fileHub: FileHub = new FileHub();
    response.json(await fileHub.getFile(request.params.id));
  }
}

export class ShareView {
  ROUTE: string = "/share/:id";

  async get(request: Request, response: Response) {
    let fileHub: FileHub = new FileHub();
    let fileObjectPath: string = await fileHub.getFileObjectPath(
      request.params.id
    );

    response.sendFile(
      fileObjectPath,
      (error: any) => {
        if (error) {
          console.log(error);
          response.json(error);
        } else {
          console.log("[ShareView] File sent", fileObjectPath);
        }
      });
  }
}
