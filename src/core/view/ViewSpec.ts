import View from "./View";

// [NOTE]
//    Route, methods and other info stored externally from view, instead of
//    declaring them as class-level variables, since i want them to be
//    specified in one united place (e.g. in AppService) and thus be easier
//    to be observed.
interface ViewSpec {
  // In future there might be a view class, and further initialization done
  // in builder to support DI
  view: View;
  route: string;
  enabledMethodNames: string[];
  // Giving this directory means enabling multipart handler
  multipartUploadDir?: string;
}

export = ViewSpec;