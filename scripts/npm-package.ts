import { $ } from "bun";

console.time("package");

await $`rm -rf package; mkdir package`;

const pkg = Bun.file("./package.json");

await Bun.write("./package/package.json", pkg);
await Bun.write("./package/README.md", Bun.file("./README.md"));
await Bun.write("./package/LICENSE", Bun.file("./LICENSE"));

await $`cp -r ./src/ ./package`;

const pkgJson = await pkg.json();

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

await Bun.write("./package/package.json", JSON.stringify(pkgJson, null, 2));

console.timeEnd("package");
