import Test from "./Test";
import AppService from "../core/app/AppService";
import {expect} from "chai";
import chaiHttp from "chai-http";
import * as _chai from "chai";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

class ApiTest extends Test {
  app: AppService;

  before() {
    this.app = new AppService({
      isProduction: false,
      hasToMaintainDatabaseConnection: false
    });
  }

  after() {
    this.app.mongo.disconnect();
  }
}

export = ApiTest;