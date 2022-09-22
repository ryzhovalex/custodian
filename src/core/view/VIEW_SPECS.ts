import FilesView from "../file/FilesView";
import ViewSpec from "./ViewSpec";

const VIEW_SPECS: ViewSpec[] = [
  {
    view: new FilesView(),
    route: "/files",
    enabledMethodNames: ["GET", "POST"],
    multipartUploadDir: "uploads/"
  }
]

export = VIEW_SPECS;