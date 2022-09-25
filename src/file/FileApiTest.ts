import {suite, test} from "@testdeck/mocha";
import chai, { expect } from "chai";
import ApiTest from "../tests/ApiTest";
import fs = require("fs");
import path = require("path");
import { File, FileHub, isFile, FileMapping } from "./File";
import { SuperAgentRequest } from "superagent";
import getAppDir from "../tools/getAppDir";

@suite class FileApiTest extends ApiTest {
  testDataDir: string;
  fileHub: FileHub = new FileHub();

  before() {
    super.before();
    this.testDataDir = path.join(getAppDir(), "src/tests");
    this.core.mongo.dropMapping(FileMapping);
  }

  protected async addFile(): Promise<File> {
    return this.fileHub.addFile({
      name: "sample1",
      internalFilename: "sample1.jpeg"   
    })
      .then((data: File) => {
        return data;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  protected async addFiles(): Promise<File[]> {
    return Promise.all([
      this.fileHub.addFile({
        name: "sample1",
        internalFilename: "sample1.jpeg"   
      }),
      this.fileHub.addFile({
        name: "sample2",
        internalFilename: "sample2.png"
      }),
      this.fileHub.addFile({
        name: "sample3",
        internalFilename: "sample3.pdf"
      })
    ])
      .then((values: File[]) => {
        return values;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Get all files" () {
    let files: File[] = await this.addFiles();

    chai.request(this.core.express)
      .get("/files")
      .then((response: any) => {
        expect(response.body).has.key("files");

        let responseFiles: any[] = response.body["files"];
        expect(responseFiles).instanceof(Array);

        expect(responseFiles.length).greaterThan(0);

        let fileIndex: number = 0;

        for (let file of responseFiles) {
          expect(isFile(file)).to.be.true;
          expect(file.id).equals(files[fileIndex].id);
          expect(file.type).equals(files[fileIndex].type);
          expect(file.name).equals(files[fileIndex].name);

          fileIndex++;
        }
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Add a file" () {
    // How to attach files in chai http within testdeck:
    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    chai.request(this.core.express)
      .post("/files")
      .attach(
        "fileObject",
        fs.readFileSync(path.join(this.testDataDir, "sample1.jpeg"))
      )
      .then((response: any) => {
        expect(isFile(response.body)).to.be.false;
        expect(response.body.name).equals("sample1");
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Get file by string id" () {
    let file: File = await this.addFile();

    chai.request(this.core.express)
      .get(`/files/${file.id}`)
      .then((response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.id).equals(file.id);
        expect(response.body.type).equals(file.type);
        expect(response.body.name).equals(file.name);
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  // @test async "Get shared file object" () {
  //   let file: File = await this.addFile();

  //   chai.request(this.core.express)
  //     .get(`/share/${file.id}`)
  //     .then((response: any) => {
  //       expect(response.headers["content-type"])
  //         .equals("image/jpeg")
  //     })
  //     .catch((error: Error) => {
  //       throw error;
  //     });
  // }
}
