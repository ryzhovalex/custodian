import chai from "chai";
import AppService from "./AppService";
import chaiHttp from "chai-http";

chai.should();
chai.expect;
chai.use(chaiHttp);

// THIS WORKS!, but WHY?
chai.request(
    new AppService({isProduction: false, hasToMaintainDatabaseConnection: false}).express)
  .post("/profile")
  .attach("fileObject", "/home/alex/projects/custodian/src/tests/sample.jpg")
  .then((response: any) => {console.log("tmp test:", response.body)});
