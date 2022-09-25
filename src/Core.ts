import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import errorhandler from 'errorhandler';
import Mongo, { DEFAULT_MONGODB_URI } from './Mongo';
import { FilesStringIdView, FilesView, ShareView, UPLOAD_DIR } from './file/File';
import path from 'path';
import multer from "multer";

export interface CoreArgs {
  isProduction: boolean;
  mongoDbUri?: string;
  hasToMaintainDatabaseConnection?: boolean;
}

export default class Core {
  express: Express;
  mongo: Mongo;
  protected isProduction: boolean;

  constructor(args: CoreArgs) {
    // Move out from src/ to project root
    process.env["EXPRESS_APP_DIR"] = path.dirname(__dirname);

    this.isProduction = args.isProduction;

    let mongoDbUri: string;
    if (args.mongoDbUri === undefined) {
      mongoDbUri = DEFAULT_MONGODB_URI;
    } else {
      mongoDbUri = args.mongoDbUri;
    }

    this.express = express();

    this.initNodes();

    // Add middleware to parse the post data of the body (handle form-data).
    // Support both JSON-encoded (json()) and url encoded (urlencoded()) bodies
    // https://stackoverflow.com/a/12008719
    this.express.use(express.json())
    this.express.use(express.urlencoded())
    this.express.use(cors());

    if (!this.isProduction) {
      this.express.use(errorhandler());
    }

    let hasToMaintainDatabaseConnection: boolean =
      args.hasToMaintainDatabaseConnection === undefined
        ? true : args.hasToMaintainDatabaseConnection;
    this.mongo = new Mongo(
      mongoDbUri, this.isProduction, hasToMaintainDatabaseConnection
    );

    // Catch error and forward to error handler
    this.express.use((request: any, response: any, next: any) => {
      let error = new Error("Not found");
      next(error);
    });

    // Error handler
    this.express.use((error: any, request: any, response: any, next: any) => {
      console.log(error.stack);
      response.status(error.status || 500);

      // Don't return stacktraces to client in production mode
      if (this.isProduction) {
        response.json({
          "errors": {
            message: error.message,
            error: {}
          }
        });
      } else {
        response.json({
          "errors": {
            message: error.message,
            error: error
          }
        });
      }
    });
  }

  async run(port: number) {
    await this.mongo.connect;
    this.express.listen(port, () => {
      console.log(`[App] Server is running at http://localhost:${port}`);
    });
  }

  protected initNodes(): void {
    let filesView: FilesView = new FilesView();

    // Copy original file name and extension uploaded
    // https://github.com/expressjs/multer/issues/439#issuecomment-276255945
    const storage = multer.diskStorage({
      destination: (request, file, cb) => {
        cb(null, UPLOAD_DIR);
      },
      filename: (request, file, cb) => {
        cb(null, file.originalname);
      }
    });
    const upload = multer({storage: storage});

    this.express.get(filesView.ROUTE, filesView.get);
    this.express.post(
      filesView.ROUTE, upload.single("fileObject"), filesView.post
    );

    let filesStringIdView: FilesStringIdView = new FilesStringIdView();
    this.express.get(filesStringIdView.ROUTE, filesStringIdView.get);

    let shareView: ShareView = new ShareView();
    this.express.get(shareView.ROUTE, shareView.get);
  }
}
