import { Response, Request, Express, IRoute } from "express";
import View from "../view/View";

class DummyView extends View {
  constructor(
      route: any,
      enabledMethodNames: string[]) {
    super(route, enabledMethodNames);
  }
  
  protected get(request: Request, response: Response): any {
    console.log(request);
    response.send("Hello!");
  }
}

export = DummyView;
