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

  private get(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  private post(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  private put(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  private patch(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }

  private delete(request: Request, response: Response): any {
    throw new Error("Not implemented");
  }
}

export = View;
