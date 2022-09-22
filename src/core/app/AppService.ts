import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import errorhandler from 'errorhandler';
import AppArgs from './AppArgs';
import View from '../view/View';
import Mongo from '../mongo/Mongo';
import Service from '../service/Service';
import FileService from '../file/FileService';
import FilesView from '../file/FilesView';
import ViewBuilder from '../view/ViewBuilder';
import VIEW_SPECS from '../view/VIEW_SPECS';

class AppService extends Service {
  isReady: boolean = false;
  express: Express;
  mongo: Mongo;
  protected isProduction: boolean;
  protected services: Service[] = [];
  protected views: View[] = [];
  protected viewBuilder: ViewBuilder;

  constructor(args: AppArgs) {
    super();
    this.isProduction = args.isProduction;

    let mongoDbUri: string;
    if (args.mongoDbUri === undefined) {
      mongoDbUri = "mongodb://localhost:27017/custodian"
    } else {
      mongoDbUri = args.mongoDbUri;
    }

    this.express = express();

    // Add middleware to parse the post data of the body (handle form-data).
    // Support both JSON-encoded (json()) and url encoded (urlencoded()) bodies
    // https://stackoverflow.com/a/12008719
    this.express.use(express.json())
    this.express.use(express.urlencoded())

    // Init views
    // This should be placed right here in code right after express init,
    // because... i don't know why
    this.viewBuilder = new ViewBuilder({
      express: this.express,
      viewSpecs: VIEW_SPECS
    }); 

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

    this.isReady = true;
  }

  run(port: number): void {
    this.express.listen(port, () => {
      console.log(`[App] Server is running at http://localhost:${port}`);
    });
  }

  protected initServices(): void {
    // Init services for now manually
    this.services.push(new FileService());
  }

  protected initViews(): void {
  }
}

export = AppService;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });