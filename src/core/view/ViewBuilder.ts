import ViewBuilderArgs from "./ViewBuilderArgs";
import {Express} from "express";
import ViewSpec from "./ViewSpec";
import multer from "multer";
import ConstructingViewError from "./ConstructingViewError";

class ViewBuilder {
  // TODO:
  //  Wrap route in logging decorators which log request
  //  and responses

  protected express: Express;
  protected viewSpecs: ViewSpec[];
  
  constructor(args: ViewBuilderArgs) {
    // NOTE:
    //    Express.route() function is not used due to strange problem with
    //    not working multipart multer parser. So default routing building
    //    logic is used
    this.express = args.express;
    this.viewSpecs = args.viewSpecs;

    for (let viewSpec of this.viewSpecs) {
      this.buildSpec(viewSpec);
    }
  }

  protected buildSpec(spec: ViewSpec): void {
    let handlers: any[];

    // Assign yourself to express app for every defined method
    for (let methodName of spec.enabledMethodNames) {
      handlers = [];

      switch (methodName.toLowerCase()) {
        case "get":
          handlers.push(spec.view.get);
          this.express.get(
            spec.route,
            ...handlers
          );
          break;
        case "post":
          // Add multipart/form-data handlers by default for post, it should be
          // pushed before view's main handler method
          // https://github.com/expressjs/multer
          if (spec.multipartUploadDir !== undefined) {
            // FIXME:
            //    Multer "single()" option is temporary hardcoded since i need
            //    only this one
            handlers.push(
              multer({dest: spec.multipartUploadDir})
              .single("fileObject")
            );
          }

          handlers.push(spec.view.post);

          this.express.post(
            spec.route,
            ...handlers
          );
          break;
        case "put":
          handlers.push(spec.view.put);
          this.express.put(
            spec.route,
            ...handlers
          );
          break;
        case "patch":
          handlers.push(spec.view.patch);
          this.express.patch(
            spec.route,
            ...handlers
          );
          break;
        case "delete":
          handlers.push(spec.view.delete);
          this.express.delete(
            spec.route,
            ...handlers
          );
          break;
        default:
          throw new ConstructingViewError(
            `Unrecognized enabled method name ${methodName}`)
      }
    }
    // TMP
    // this.express.post("/profile", (req: any, res: any) => {console.log(1)})
    // console.log("[ViewBuilder] express routes:", this.express.routes)
  }
}

export = ViewBuilder;