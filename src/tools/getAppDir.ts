export default function getAppDir(): string {
  let appDir: string | undefined = process.env.EXPRESS_APP_DIR;

  if (typeof(appDir) === "undefined") {
    throw new Error(
      "[getAppDir.SystemError]"
      + " App should set EXPRESS_APP_DIR environ, but it hasn't been happened"
    );
  } else {
    return appDir;
  }
}