import Test from "./Test";
import {expect} from "chai";
import chaiHttp from "chai-http";
import * as _chai from "chai";
import Core from "../Core";
import mongoose from "mongoose";
import { DEFAULT_MONGODB_URI } from "../Mongo";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

class ApiTest extends Test {
  core: Core = new Core({
    isProduction: false,
    hasToMaintainDatabaseConnection: false,
  });

  static async before() {
    await mongoose.connect(DEFAULT_MONGODB_URI);
  }

  async before() {
  }
  
  async after() {

  }

  static async after() {
    await mongoose.disconnect();
  }
}

export = ApiTest;