import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import errorhandler from 'errorhandler';
import AppArgs from './AppArgs';

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
    this.app.use((req, res, next) => {
      let error = new Error("Not found");
      next(error);
    });

    // Init development error handler to print stacktrace
    if (!this.isProduction) {
      this.app.use((err, req, res, next) => {
        console.log(err.stack);
        res.status(err.status || 500);
      });
    }
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
