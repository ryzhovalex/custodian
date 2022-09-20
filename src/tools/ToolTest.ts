import {suite, test} from "@testdeck/mocha";
import {Express} from "express";
import * as _chai from "chai";
import {expect} from "chai";
import Test from "../tests/Test";
import makeid from "./makeid";

_chai.should();
_chai.expect;


@suite class ToolTest extends Test {
  makeid: () => string = makeid;
  out: string;

  before() {
    this.out = makeid();
  }

  @test "App is created" () {
    expect(this.out).to.be.string;
  }
}