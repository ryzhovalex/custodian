import AppService from './src/Core';
import dotenv from 'dotenv';

dotenv.config();

// const port: string =
//   process.env.CUSTODIAN_PORT ? process.env.CUSTODIAN_PORT : "5000";
const port: string = process.env.CUSTODIAN_PORT || "5000";
const isProduction: boolean =
  process.env.CUSTODIAN_IS_PRODUCTION?.toLowerCase() === "true" || false;
const mongoDbUri: string | undefined =
  process.env.CUSTODIAN_MONGO_DB_URI || undefined

let app: AppService = new AppService({
  isProduction: isProduction,
  mongoDbUri: mongoDbUri
});

app.run(parseInt(port));
