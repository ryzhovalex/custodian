import { Express, Response, Request, IRoute, RequestHandler } from "express";

class View {
  get(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  post(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  put(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  patch(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  delete(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }
}

export = View;
