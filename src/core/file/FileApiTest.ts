import {suite, test} from "@testdeck/mocha";
import chai, { expect } from "chai";
import ApiTest from "../../tests/ApiTest";
import fs = require("fs");
import path = require("path");
import File, { isFile } from "./File";

@suite class FileApiTest extends ApiTest {
  @test "GET /files" () {
    chai.request(this.app.express)
      .get("/files")
      .then((response: any) => {
        let files: any[] = response.body["files"];

        expect(files.length).greaterThan(0);

        for (let file of files) {
          expect(isFile(file)).to.be.true;
        }
      });
  }

  @test "POST /files" () {
    let sampleFilePath: string = path.join(
      __dirname, "../../tests/sample.jpg");

    let fileName: string = "sample";

    // How to attach files in chai http within testdeck:
    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    chai.request(this.app.express)
      .post("/files")
      .attach("fileObject", fs.readFileSync(sampleFilePath), fileName)
      .then((response: any) => {
        console.log("[FileApiTest] response body/:", response.body);
      });
  }
}
