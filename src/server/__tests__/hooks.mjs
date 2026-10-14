import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const extensions = [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx", "/index.js"];

function tryResolveFile(filePath) {
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }
  for (const ext of extensions) {
    const candidate = filePath + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  const { parentURL } = context;

  if (specifier.startsWith("@/")) {
    const relativePath = specifier.slice(2);
    const basePath = path.join(process.cwd(), "src", relativePath);
    const resolvedPath = tryResolveFile(basePath);
    if (resolvedPath) {
      return {
        url: pathToFileURL(resolvedPath).href,
        shortCircuit: true,
      };
    }
  }

  // Handle relative imports without extensions
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    if (parentURL && parentURL.startsWith("file://")) {
      const parentDir = path.dirname(new URL(parentURL).pathname);
      const targetPath = path.resolve(parentDir, specifier);
      const resolvedPath = tryResolveFile(targetPath);
      if (resolvedPath) {
        return {
          url: pathToFileURL(resolvedPath).href,
          shortCircuit: true,
        };
      }
    }
  }

  return nextResolve(specifier, context);
}
