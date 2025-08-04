import { accessSync, constants } from "node:fs";
import { execSync } from "node:child_process";

const ZX_PATH = "./node_modules/.bin/zx";
if(!zxExists()) {
  execSync('pnpm  --frozen-lockfile install', { stdio: 'inherit' });
}


function zxExists() {
  try {
    accessSync(ZX_PATH, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}