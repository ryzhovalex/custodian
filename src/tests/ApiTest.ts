import Test from "./Test";
import AppService from "../App";
import {expect} from "chai";
import chaiHttp from "chai-http";
import * as _chai from "chai";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

class ApiTest extends Test {
  appService: AppService;

  before() {
    this.appService = new AppService({
      isProduction: false,
      hasToMaintainDatabaseConnection: false
    });
  }

  after() {
    this.appService.mongo.disconnect();
  }
}

export = ApiTest;