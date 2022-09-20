import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import View from "../view/View";

class FilesView extends View {
  constructor(route: any, enabledMethodNames: string[]) {
    super(route, enabledMethodNames);
  }

  protected get(request: Request, response: Response) {

  }

  protected post(
      request: Request,
      response: Response) {
    console.log(
      "[FilesView]",
      request.headers,
      request.body,
      request.file,
      request.files);
    response.send({"message": "Hello!"});
  }
}

export = FilesView;