import {suite, test} from "@testdeck/mocha";
import chai, { expect } from "chai";
import ApiTest from "../tests/ApiTest";
import fs = require("fs");
import path = require("path");
import { File, isFile } from "./File";
import { SuperAgentRequest } from "superagent";

@suite class FileApiTest extends ApiTest {
  sampleFilePath: string = path.join(
    __dirname, "../tests/sample.jpg");
  fileName: string = "sample";

  @test "Get all files" (done: any) {
    chai.request(this.core.express)
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
    // How to attach files in chai http within testdeck:
    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    chai.request(this.core.express)
      .post("/files")
      .attach(
        "fileObject", fs.readFileSync(this.sampleFilePath), this.fileName
      )
      .end((error: any, response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals(this.fileName);
        done();
      });
  }

  @test "Add a file, then get it" (done: any) {
    let fileName: string = "sample";

    chai.request(this.core.express)
      .post("/files")
      .attach("fileObject", fs.readFileSync(this.sampleFilePath), fileName)
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
    return chai.request(this.core.express)
      .get(`/files/${stringId}`)
  }
}
