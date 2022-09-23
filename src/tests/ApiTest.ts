import Test from "./Test";
import {expect} from "chai";
import chaiHttp from "chai-http";
import * as _chai from "chai";
import Core from "../Core";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

class ApiTest extends Test {
  core: Core;

  before() {
    this.core = new Core({
      isProduction: false,
      hasToMaintainDatabaseConnection: false
    });
  }

  after() {
    this.core.mongo.disconnect();
  }
}

export = ApiTest;