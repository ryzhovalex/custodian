import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import errorhandler from 'errorhandler';
import AppArgs from './AppArgs';
import { Router } from 'express';
import DummyView from '../dummy/DummyView';
import View from '../view/View';
import Mongo from '../mongo/Mongo';

class App {
  isReady: boolean = false;
  express: Express;
  mongo: Mongo;
  protected isProduction: boolean;
  protected mongoDbUri: string;
  protected views: View[] = [];

  constructor(args: AppArgs) {
    this.isProduction = args.isProduction;

    if (args.mongoDbUri === undefined) {
      this.mongoDbUri = "mongodb://localhost/custodian"
    } else {
      this.mongoDbUri = args.mongoDbUri;
    }

    this.express = express();

    // Init views
    // This should be placed right here in code right after express init,
    // because... i don't know why
    this.views.push(
      new DummyView(this.express.route("/dummy"), ["GET", "POST"]));

    this.express.use(cors());

    if (!this.isProduction) {
      this.express.use(errorhandler());
    }

    this.mongo = new Mongo(this.mongoDbUri, this.isProduction);

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
      console.log(`Server is running at http://localhost:${port}`);
    });
  }
}

export = App;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });
