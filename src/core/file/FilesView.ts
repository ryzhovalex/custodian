import { Request, Response } from "express";
import View from "../view/View";

class FilesView extends View {
  constructor() {
    super();
  }

  get(request: Request, response: Response) {

  }

  post(
      request: Request,
      response: Response) {
    console.log(
      "[FilesView] request headers/body/file/files/fileJsonified",
      request.headers,
      request.body,
      request.file,
      request.files,
      JSON.stringify(request.file)
    );
    response.send({"message": "Hello!"});
  }
}

export = FilesView;