import mongoose from "mongoose";

export const DEFAULT_MONGODB_URI: string =
  "mongodb://localhost:27017/custodian";

export default class Mongo {
  /**
   * Model representing mongodb database interactions.
   * 
   * @param uri
   * @param isProduction
   * @param hasToMaintainConnection
   */

  constructor(
      public uri: string,
      protected isProduction: boolean,
      public hasToMaintainConnection: boolean,
    ) {
    // Maintain connection
    if (this.hasToMaintainConnection) {
      mongoose.connection.on("disconnected", this.connect);
    }

    if (!this.isProduction) {
      mongoose.set("debug", true);
    }
  }

  async connect(): Promise<any> {
    console.info(`[Mongo] Connecting ${this.uri}`);
    return mongoose
      .connect(this.uri)
      .then(() => {
        console.info(`[Mongo] Connected`);
      })
      .catch((error: any) => {
        console.error("[Mongo] Error connection to mongodb: ", error);
      });
  }

  async disconnect(): Promise<any> {
    return mongoose.disconnect()
      .then(() => {
        console.info(`[Mongo] Disconnected`);
      })
      .catch((error: any) => {
        console.error(
          "[Mongo] Error during disconnecting from mongodb: ", error);
      });
  }

  /**
   * Removes all entries for given mapping.
   * 
   * Useful for unit-tests isolation.
   */
  async dropMapping(mapping: mongoose.Model<any>): Promise<any> {
    console.log("[Mongo] Drop mapping", mapping);
    mapping.deleteMany({})
      .then((value: any) => {
        console.log("[Mongo] Collection", mapping, "dropped");
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
