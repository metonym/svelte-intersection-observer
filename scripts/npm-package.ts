import { readdirSync } from "node:fs";
import { $ } from "bun";
import { parse } from "svelte/compiler";
import ts from "typescript";

console.time("package");

await $`rm -rf package; mkdir package`;

const pkg = Bun.file("./package.json");

await Bun.write("./package/package.json", pkg);
await Bun.write("./package/README.md", Bun.file("./README.md"));
await Bun.write("./package/LICENSE", Bun.file("./LICENSE"));

await $`cp -r ./src/* ./package/`;

const { scripts, devDependencies, ...pkgJson } = await pkg.json();

pkgJson.svelte = "./index.js";
pkgJson.main = "./index.js";
pkgJson.types = "./index.d.ts";
pkgJson.exports = {
  ".": {
    types: "./index.d.ts",
    svelte: "./index.js",
    import: "./index.js",
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

/** Comment ranges (byte offsets, delimiters included) found in a source string. */
interface CommentRange {
  start: number;
  end: number;
}

function getJsCommentRanges(source: string): CommentRange[] {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    /* skipTrivia */ false,
    ts.LanguageVariant.Standard,
    source,
  );
  const ranges: CommentRange[] = [];
  let token = scanner.scan();
  while (token !== ts.SyntaxKind.EndOfFileToken) {
    if (
      token === ts.SyntaxKind.SingleLineCommentTrivia ||
      token === ts.SyntaxKind.MultiLineCommentTrivia
    ) {
      ranges.push({
        start: scanner.getTokenStart(),
        end: scanner.getTokenEnd(),
      });
    }
    token = scanner.scan();
  }
  return ranges;
}

function getSvelteScriptCommentRanges(source: string): CommentRange[] {
  const ast = parse(source, { modern: true });
  return ast.comments.map((comment) => ({
    start: comment.start,
    end: comment.end,
  }));
}

const WHITESPACE = /^[ \t]*$/;
const isWhitespace = (text: string) => WHITESPACE.test(text);

/** Removes the given comment ranges, dropping the whole line for standalone comments. */
function stripComments(source: string, ranges: CommentRange[]): string {
  let result = source;

  for (let i = ranges.length - 1; i >= 0; i--) {
    const { start, end } = ranges[i];
    const lineStart = result.lastIndexOf("\n", start - 1) + 1;
    const nextNewline = result.indexOf("\n", end);
    const lineEnd = nextNewline === -1 ? result.length : nextNewline;

    const before = result.slice(lineStart, start);
    const after = result.slice(end, lineEnd);

    if (isWhitespace(before) && isWhitespace(after)) {
      // Comment is the only thing on the line: drop the whole line.
      const deleteEnd = lineEnd < result.length ? lineEnd + 1 : lineEnd;
      result = result.slice(0, lineStart) + result.slice(deleteEnd);
    } else if (isWhitespace(before)) {
      // Comment opens the line but code follows (e.g. a type-cast wrapping
      // an expression): drop the leading indentation along with it.
      result = result.slice(0, lineStart) + result.slice(end);
    } else {
      result = result.slice(0, start) + result.slice(end);
    }
  }

  return result.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

await Promise.all(
  readdirSync("./package").map(async (file) => {
    const path = `./package/${file}`;

    if (file.endsWith(".svelte")) {
      const source = await Bun.file(path).text();
      await Bun.write(
        path,
        stripComments(source, getSvelteScriptCommentRanges(source)),
      );
    } else if (file.endsWith(".js")) {
      const source = await Bun.file(path).text();
      await Bun.write(path, stripComments(source, getJsCommentRanges(source)));
    }
  }),
);

console.timeEnd("package");
