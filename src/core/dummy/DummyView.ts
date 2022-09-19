import { Response, Request } from "express";
import View from "../view/View";

class DummyView extends View {
  constructor() {
    super();
  }

  private get(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }
}

export = DummyView;
