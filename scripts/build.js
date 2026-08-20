import { build, context } from "esbuild";
import { cpSync, mkdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const rootDir = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const extensionDir = join(rootDir, "extension");
const distDir = join(rootDir, "dist");

const sharedBuildOptions = {
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["chrome109"],
  logLevel: "info"
};

const entryPoints = [
  { in: join(extensionDir, "background.js"), out: "background" },
  { in: join(extensionDir, "content.js"), out: "content" },
  { in: join(extensionDir, "popup.js"), out: "popup" }
];

function copyStaticAssets() {
  cpSync(join(extensionDir, "manifest.json"), join(distDir, "manifest.json"));
  cpSync(join(extensionDir, "popup.html"), join(distDir, "popup.html"));
}

async function runBuild(watch = false) {
  rmSync(distDir, { recursive: true, force: true });
  mkdirSync(distDir, { recursive: true });
  copyStaticAssets();

  if (watch) {
    const contexts = await Promise.all(
      entryPoints.map(({ in: input, out }) =>
        context({
          ...sharedBuildOptions,
          entryPoints: [input],
          outfile: join(distDir, `${out}.js`)
        })
      )
    );

    await Promise.all(contexts.map((ctx) => ctx.watch()));
    console.log("Watching extension files for changes...");
    return;
  }

  await Promise.all(
    entryPoints.map(({ in: input, out }) =>
      build({
        ...sharedBuildOptions,
        entryPoints: [input],
        outfile: join(distDir, `${out}.js`)
      })
    )
  );

  console.log("Extension built to dist/");
}

const watch = process.argv.includes("--watch");
runBuild(watch).catch((error) => {
  console.error(error);
  process.exit(1);
});
