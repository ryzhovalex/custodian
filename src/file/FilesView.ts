import { Request, Response } from "express";
import View from "../../view/View";

export default class FilesView extends View {
  constructor() {
    super();
  }

  get(request: Request, response: Response) {
    response.send({"message": "Test"});
  }

  post(request: Request, response: Response) {
    response.send({"message": "Test"});
  }
}
