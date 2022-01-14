const fs = require("fs");
const path = require("path");
const { exec: child_process_exec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(child_process_exec);

const dirs = fs
  .readdirSync("examples")
  .map((i) => path.join("examples", i))
  .filter((i) => fs.lstatSync(i).isDirectory());

const execCwd = async (dir, ...args) => await exec(`yarn --cwd ${dir} ${args}`);

(async () => {
  try {
    for await (const dir of dirs) {
      console.info("[examples] Testing", dir);
      await execCwd(dir, "install");
      const build = await execCwd(dir, "build");
      process.stdout.write(build.stdout + "\n");
    }

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
