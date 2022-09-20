interface AppArgs {
  isProduction: boolean;

  mongoDbUri?: string;
  hasToMaintainDatabaseConnection?: boolean;
}

export = AppArgs;
