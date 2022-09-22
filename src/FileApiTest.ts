import {suite, test} from "@testdeck/mocha";
import chai, { expect } from "chai";
import ApiTest from "../../tests/ApiTest";
import fs = require("fs");
import path = require("path");
import File, { isFile } from "./File";
import { SuperAgentRequest } from "superagent";
import FileService from "./FileService";

@suite class FileApiTest extends ApiTest {
  @test "Get all files" (done: any) {
    chai.request(this.appService.express)
      .get("/files")
      .end((error: any, response: any) => {
        expect(response.body).has.key("files");
        let files: any[] = response.body["files"];

        expect(files.length).greaterThan(0);

        for (let file of files) {
          expect(isFile(file)).to.be.true;
        }

        done();
      });
  }

  @test "Add a file" (done: any) {
    let sampleFilePath: string = path.join(
      __dirname, "../../tests/sample.jpg");

    let fileName: string = "sample";

    // How to attach files in chai http within testdeck:
    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    chai.request(this.appService.express)
      .post("/files")
      .attach("fileObject", fs.readFileSync(sampleFilePath), fileName)
      .end((error: any, response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals(fileName);
        done();
      });
  }

  @test "Add a file, then get it" (done: any) {
    let sampleFilePath: string = path.join(
      __dirname, "../../tests/sample.jpg");

    let fileName: string = "sample";

    chai.request(this.appService.express)
      .post("/files")
      .attach("fileObject", fs.readFileSync(sampleFilePath), fileName)
      .end((error: any, response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals(fileName);
        this.getFilesStringId(response.body.stringId)
          .end((response: any) => {
            expect(isFile(response.body)).to.be.true;
            expect(response.body.name).equals(fileName);
            done();
          });
      });
  }

  @test "Get file by string id" (done: any) {
  }

  protected getFilesStringId(stringId: string): SuperAgentRequest {
    return chai.request(this.appService.express)
      .get(`/files/${stringId}`)
  }
}
