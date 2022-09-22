import FilesView from "../file/FilesView";
import ViewSpec from "../core/builder/spec/ViewSpec";

const VIEW_SPECS: ViewSpec[] = [
  {
    view: new FilesView(),
    route: "/files",
    enabledMethodNames: ["GET", "POST"],
    multipartUploadDir: "uploads/"
  }
]

export = VIEW_SPECS;