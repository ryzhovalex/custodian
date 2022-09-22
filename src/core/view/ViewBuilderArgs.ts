import {Express} from "express";
import ViewSpec from "./ViewSpec";

interface ViewBuilderArgs {
  express: Express;
  viewSpecs: ViewSpec[];
}

export = ViewBuilderArgs;
