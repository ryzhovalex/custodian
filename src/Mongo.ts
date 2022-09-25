import mongoose from "mongoose";

class Mongo {
  /**
   * Model representing mongodb database interactions.
   * 
   * @param uri
   * @param isProduction
   * @param hasToMaintainConnection
   */

  constructor(
      protected uri: string,
      protected isProduction: boolean,
      public hasToMaintainConnection: boolean,
      protected hasToAutoConnectDatabase: boolean
    ) {
    if (hasToAutoConnectDatabase)  
      this.connect();

    // Maintain connection
    if (this.hasToMaintainConnection) {
      mongoose.connection.on("disconnected", this.connect);
    }

    if (!this.isProduction) {
      mongoose.set("debug", true);
    }
  }

  connect() {
    console.info(`[Mongo] Connecting ${this.uri}`);
    mongoose
      .connect(this.uri)
      .then(() => {
        console.info(`[Mongo] Connected`);
      })
      .catch((error: any) => {
        console.error("[Mongo] Error connection to mongodb: ", error);
      });
  }

  disconnect() {
    mongoose.disconnect()
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
  dropMapping(mapping: mongoose.Model<any>) {
    console.log("[Mongo] Drop mapping", mapping);
    mapping.remove({});
  }
}

export = Mongo;
