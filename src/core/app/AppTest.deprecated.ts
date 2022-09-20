import App from "./App";
import {suite, test} from "@testdeck/mocha";
import {Express} from "express";
import * as _chai from "chai";
import {expect} from "chai";
import Test from "../../tests/Test";

_chai.should();
_chai.expect;


@suite class AppTest extends Test {
  protected app: App;

  before() {
    this.app = new App({
      isProduction: false,
      mongoDbUri: "mongodb://localhost/conduit"  
    });
  }

  @test "App is created" () {
    this.app.isReady.should.to.be.true;
  }
}





