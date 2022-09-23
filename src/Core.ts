import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import errorhandler from 'errorhandler';
import Mongo from './Mongo';
import { FilesStringIdView, FilesView, ShareView } from './file/File';

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
    this.isProduction = args.isProduction;

    let mongoDbUri: string;
    if (args.mongoDbUri === undefined) {
      mongoDbUri = "mongodb://localhost:27017/custodian"
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

  run(port: number): void {
    this.express.listen(port, () => {
      console.log(`[App] Server is running at http://localhost:${port}`);
    });
  }

  protected initNodes(): void {
    let filesView: FilesView = new FilesView();
    this.express.get(filesView.ROUTE, filesView.get);
    this.express.post(filesView.ROUTE, filesView.post);

    let filesStringIdView: FilesStringIdView = new FilesStringIdView();
    this.express.get(filesStringIdView.ROUTE, filesStringIdView.get);

    let shareView: ShareView = new ShareView();
    this.express.get(shareView.ROUTE, filesStringIdView.get);
  }
}