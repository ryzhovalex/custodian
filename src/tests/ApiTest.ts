import Test from "./Test";
import {expect} from "chai";
import chaiHttp from "chai-http";
import * as _chai from "chai";
import Core from "../Core";
import mongoose from "mongoose";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

class ApiTest extends Test {
  core: Core = new Core({
    isProduction: false,
    hasToMaintainDatabaseConnection: true,
    hasToAutoConnectDatabase: true
  });

  before() {
  }
  
  after() {

  }

  static after() {
    mongoose.disconnect();
  }
}

export = ApiTest;