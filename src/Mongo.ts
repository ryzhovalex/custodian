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
      public uri: string,
      protected isProduction: boolean,
      public hasToMaintainConnection: boolean
    ) {
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
}

export = Mongo;
