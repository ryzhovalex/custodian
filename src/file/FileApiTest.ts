import {suite, test} from "@testdeck/mocha";
import chai, { expect } from "chai";
import ApiTest from "../tests/ApiTest";
import fs = require("fs");
import path = require("path");
import { File, FileHub, isFile } from "./File";
import { SuperAgentRequest } from "superagent";

@suite class FileApiTest extends ApiTest {
  sampleFilePath: string = path.join(
    __dirname, "../tests/sample.jpg");
  fileName: string = "sample";
  fileHub: FileHub = new FileHub();

  @test "Get all files" (done: any) {
    chai.request(this.core.express)
      .get("/files")
      .end((error: any, response: any) => {
        expect(response.body).has.key("files");

        let files: any[] = response.body["files"];
        expect(files).instanceof(Array);

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
        "fileObject", fs.readFileSync(this.sampleFilePath)
      )
      .end((error: any, response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals(this.fileName);
        done();
      });
  }

  @test "Get file by string id" (done: any) {
    // This time, add file directly
    let file: File = this.fileHub.addFile({
      "name": "file",
      "internalFilename": "sample.jpg"
    }) 

    chai.request(this.core.express)
      .get(`/files/${file.stringId}`)
      .end((error: any, response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals(this.fileName);
        done();
      })
  }

  @test "Get shared file object" (done: any) {
    let file: File = this.fileHub.addFile({
      "name": "file",
      "internalFilename": "sample.jpg"
    }) 

    chai.request(this.core.express)
      .get(`/share/${file.stringId}`)
      .end((error: any, response: any) => {
        expect(response.headers["content-type"])
          .equals("image/jpeg")
        done();
      })
  }
}
