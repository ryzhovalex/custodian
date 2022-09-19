import { Response, Request, Router } from "express";

class View {
  router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', (request: Request, response: Response) => this.get);
    this.router.post('/', (request: Request, response: Response) => this.get);
    this.router.put('/', (request: Request, response: Response) => this.get);
    this.router.patch('/', (request: Request, response: Response) => this.get);
    this.router.delete('/', (request: Request, response: Response) => this.get);
  }

  protected get(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  protected post(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  protected put(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  protected patch(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  protected delete(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }
}

export = View;
