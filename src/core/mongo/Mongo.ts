import mongoose from "mongoose";

class Mongo {
  constructor(public uri: string, protected isProduction: boolean) {
    this.connect();

    mongoose.connection.on("disconnected", this.connect);

    if (!this.isProduction) {
      mongoose.set("debug", true);
    }
  }

  connect() {
    mongoose
      .connect(this.uri)
      .then(() => {
        console.info(`Connected to ${this.uri}`);
      })
      .catch((error: any) => {
        console.error("Error connection to mongodb: ", error);
      });
  }

  disconnect() {
    mongoose.disconnect()
      .then(() => {
        console.info(`Disconnected from ${this.uri}`);
      })
      .catch((error: any) => {
        console.error("Error during disconnecting from mongodb: ", error);
      });
  }
}

export = Mongo;
