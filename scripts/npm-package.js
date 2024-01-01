// @ts-check

import fs from "node:fs";
import fsp from "node:fs/promises";

(async () => {
  console.time("package");

  if (fs.existsSync("./package")) {
    await fsp.rm("./package", { recursive: true });
  }

  await fsp.mkdir("./package");

  await fsp.cp("./src", "./package", { recursive: true });
  await fsp.copyFile("./package.json", "./package/package.json");
  await fsp.copyFile("./README.md", "./package/README.md");
  await fsp.copyFile("./LICENSE", "./package/LICENSE");

  const pkgJson = JSON.parse(
    fs.readFileSync("./package/package.json", "utf-8"),
  );

  delete pkgJson.scripts;
  delete pkgJson.devDependencies;
  delete pkgJson.prettier;

  pkgJson.main = "./index.js";
  pkgJson.types = "./index.d.ts";
  pkgJson.exports = {
    ".": {
      types: "./index.d.ts",
      svelte: "./index.js",
    },
    "./*.svelte": {
      types: "./*.svelte.d.ts",
      import: "./*.svelte",
    },
    "./*": {
      types: "./*.d.ts",
      import: "./*.js",
    },
  };

  await fsp.writeFile(
    "./package/package.json",
    JSON.stringify(pkgJson, null, 2),
  );

  console.timeEnd("package");
})();
