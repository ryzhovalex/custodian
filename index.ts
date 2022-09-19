import App from './src/core/app/App';
import dotenv from 'dotenv';

dotenv.config();

// const port: string =
//   process.env.CUSTODIAN_PORT ? process.env.CUSTODIAN_PORT : "5000";
const port: string = process.env.CUSTODIAN_PORT || "5000";
const isProduction: boolean =
  process.env.CUSTODIAN_IS_PRODUCTION?.toLowerCase() === "true" || false;
const mongoDbUri: string =
  process.env.CUSTODIAN_MONGO_DB_URI || "mongodb://localhost/conduit"

let app: App = new App(isProduction, mongoDbUri);

app.run(parseInt(port));
