const fs = require("fs");
const path = require("path");
const { exec: child_process_exec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(child_process_exec);

(async () => {
  const dirs = fs
    .readdirSync("examples")
    .map((i) => path.join("examples", i))
    .filter((i) => fs.lstatSync(i).isDirectory());

  try {
    for await (const dir of dirs) {
      console.info("[examples] Testing", dir);
      await exec(`yarn --cwd ${dir} install`);
      const build = await exec(`yarn --cwd ${dir} build`);
      process.stdout.write(build.stdout + "\n");
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
