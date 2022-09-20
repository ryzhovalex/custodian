import { Express, Response, Request, IRoute } from "express";
import ConstructingViewError from "./ConstructingViewError";
import multer = require("multer");

class View {
  // TODO:
  //  Wrap route in logging decorators which log request
  //  and responses

  // Directory where multer will save multipart attachments
  UPLOAD_DIR: string = "uploads/";
  protected uploadMulter: multer.Multer;

  constructor(
      // Some strange typings for express Route, so leave it "any"
      protected route: any,
      protected enabledMethodNames: string[]) {
    this.uploadMulter = multer({dest: this.UPLOAD_DIR});

    // Assign yourself to express app for every defined method
    for (let methodName of this.enabledMethodNames) {
      switch (methodName.toLowerCase()) {
        case "get":
          this.route = this.route.get(this.get);
          break;
        case "post":
          // Add multipart/form-data handlers by default for post
          // https://github.com/expressjs/multer
          this.route = this.route.post(
            this.post, this.uploadMulter.single("fileObject"));
          break;
        case "put":
          this.route = this.route.put(this.put);
          break;
        case "patch":
          this.route = this.route.patch(this.patch);
          break;
        case "delete":
          this.route = this.route.delete(this.delete);
          break;
        default:
          throw new ConstructingViewError(
            `Unrecognized enabled method name ${methodName}`)
      }
    }
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
