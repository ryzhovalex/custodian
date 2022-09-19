import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import errorhandler from 'errorhandler';
import AppArgs from './AppArgs';
import { Router } from 'express';
import DummyView from '../dummy/DummyView';

class App {
  private app: Express;
  private isProduction: boolean;
  private mongoDbUri: string;

  constructor(args: AppArgs) {
    this.isProduction = args.isProduction;
    this.mongoDbUri = args.mongoDbUri;

    this.app = express();

    this.app.use(cors());

    if (!this.isProduction) {
      this.app.use(errorhandler());
    }

    mongoose.connect(this.mongoDbUri);

    if(this.isProduction) {
      mongoose.set("debug", true);
    }

    // Catch error and forward to error handler
    this.app.use((request: any, response: any, next: any) => {
      let error = new Error("Not found");
      next(error);
    });

    // Error handler
    this.app.use((error: any, request: any, response: any, next: any) => {
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

    // Add routes
    this.app.use('/dummy', DummyView.router);
  }

  run(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  }
}

export = App;

// app.get('/', (req: Request, res: Response) => {
//   res.send('Express + TypeScript Server');
// });
