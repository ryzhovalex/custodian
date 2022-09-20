import {suite, test} from "@testdeck/mocha";
import chai from "chai";
import ApiTest from "../../tests/ApiTest";
import fs = require("fs");
import path = require("path");

@suite class FileApiTest extends ApiTest {
  // @test "GET /files" () {
  //   chai.request(this.app.express)
  //     .get("/files")
  //     .then((response: any) => {
  //       let files: any[] = response.body["files"];

  //       expect(files.length).greaterThan(0);

  //       for (let file of files) {
  //         expect(file["name"]).is.string;
  //         expect(file["strindId"]).is.string;
  //       }
  //     });
  // }

  @test "POST /files" () {
    let sampleFilePath: string = path.join(
      __dirname, "../../tests/sample.jpg");

    let fileName: string = "sample";

    // https://github.com/chaijs/chai-http/issues/168#issuecomment-353721847
    chai.request(this.app.express)
      .post("/files")
      .attach("fileObject", fs.readFileSync(sampleFilePath), fileName)
      .then((response: any) => {
        console.log("[FileApiTest]", response.body);
      });

    // fs.readFile(
    //   sampleFilePath,
    //   {encoding: "utf-8"},
    //   (error, data) => {
    //     if (!error) {
    //       fileObject = data;
    //     } else {
    //       console.log(error);
    //     }

    //     console.log("request")

    //     chai.request(this.app.express)
    //       .post("/files")
    //       .field("name", fileName)
    //       .type("multipart/form-data")
    //       // .send({
    //       //   name: fileName,
    //       //   fileObject: fileObject
    //       // })
    //       .then((response: any) => {
    //         console.log(response)
    //       });
    //   }
    // );
  }
}
