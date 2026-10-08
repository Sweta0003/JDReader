import * as esbuild from "esbuild";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function resolveAlias(specifier) {
  const rel = specifier.replace(/^@\//, "");
  const base = path.join(root, rel);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    path.join(base, "index.ts"),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

await esbuild.build({
  entryPoints: [path.join(root, "static/pages-entry.ts")],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  outfile: path.join(root, "docs/app.js"),
  external: ["https://cdn.jsdelivr.net/*"],
  plugins: [
    {
      name: "at-alias",
      setup(build) {
        build.onResolve({ filter: /^@\// }, (args) => {
          const resolved = resolveAlias(args.path);
          if (!resolved) return { errors: [{ text: `Cannot resolve ${args.path}` }] };
          return { path: resolved };
        });
      },
    },
  ],
});

console.log("Wrote docs/app.js");
