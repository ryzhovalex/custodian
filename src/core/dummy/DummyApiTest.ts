import {suite, test} from "@testdeck/mocha";
import {expect} from "chai";
import ApiTest from "../../tests/ApiTest";
import chaiHttp from "chai-http";
import chai from "chai";

@suite class DummyApiTest extends ApiTest {
  @test "GET /dummy" () {
    chai.request(this.app.express)
      .get("/dummy")
      .then((response: any) => {
        expect(response.body["message"]).equals("Hello!")
        expect(response.headers["content-type"])
          .equals("application/json; charset=utf-8");
      });
  }
}




