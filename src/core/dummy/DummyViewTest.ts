import {suite, test} from "@testdeck/mocha";
import {Express} from "express";
import * as _chai from "chai";
import {expect} from "chai";
import Test from "../../tests/Test";
import chaiHttp from "chai-http";
import App from "../app/App";
import DummyView from "./DummyView";
import { describe, it } from "node:test";
import chai from "chai";

_chai.should();
_chai.expect;
_chai.use(chaiHttp);

@suite class DummyViewTest extends Test {
  app: App;

  before() {
    this.app = new App({ isProduction: false});
  }

  @test "GET" () {
    chai.request(this.app.express)
      .get("/dummy")
      .then((response: any) => {
        expect(response.body).has.key("message");
        // expect(response.headers).has.key("content-type");
        expect(response.headers["content-type"])
          .equals("application/json; charset=utf-8");
      });
  }
}




