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

  async before() {
    super.before();
    this.testDataDir = path.join(getAppDir(), "src/tests");
  }

  async after() {
    await this.core.mongo.dropMapping(FileMapping);
  }

  protected async addFile(): Promise<File> {
    return this.fileHub.addFile({
      name: "sample1.jpeg"
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
        name: "sample1.jpeg"   
      }),
      this.fileHub.addFile({
        name: "sample2.png"
      }),
      this.fileHub.addFile({
        name: "sample3.pdf"
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

    return chai.request(this.core.express)
      .get("/files")
      .then((response: any) => {
        expect(response.body).has.key("files");

        let responseFiles: any[] = response.body["files"];
        expect(responseFiles).instanceof(Array);

        expect(responseFiles.length).greaterThan(0);

        let isMatchedFileFound: boolean;

        for (let file of responseFiles) {
          isMatchedFileFound = false; 
          expect(isFile(file)).to.be.true;

          for (let addedFile of files) {
            if (addedFile.name == file.name) {
              expect(file.id).equals(addedFile.id);
              expect(file.type).equals(addedFile.type);
              isMatchedFileFound = true;
            }
          }

          expect(
            isMatchedFileFound,
            "Matched file among created ones should be found"
          ).to.be.true;
        }
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Add a file" () {
    // How to attach files in chai http within testdeck:
    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    return chai.request(this.core.express)
      .post("/files")
      .attach(
        "fileObject",
        path.join(this.testDataDir, "sample1.jpeg")
      )
      .then((response: any) => {
        expect(isFile(response.body)).to.be.true;
        expect(response.body.name).equals("sample1.jpeg");
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Get file by string id" () {
    let file: File = await this.addFile();

    return chai.request(this.core.express)
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

  @test async "Get shared file object" () {
    let file: File = await this.addFile();

    return chai.request(this.core.express)
      .get(`/share/${file.id}`)
      .then((response: any) => {
        expect(response.headers["content-type"])
          .equals("image/jpeg")
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  @test async "Delete all files" () {
    await this.addFiles();

    return chai.request(this.core.express)
      .delete("/files")
      .then(async (response: any) => {
        let files = await this.fileHub.getAllFiles();
        expect(files).has.key("files");
        expect(files.files).to.be.empty;
      })
      .catch((error: Error) => {
        throw error;
      });
  }
}
