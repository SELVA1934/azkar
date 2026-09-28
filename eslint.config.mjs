import { defineConfig, globalIgnores } from "eslint/config";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// eslint-config-next is a devDependency. Some analysis environments install
// only production dependencies, so resolve it defensively: local `npm run lint`
// keeps the full Next.js rules, while a container without dev dependencies
// still gets a working (base-rules-only) config instead of a load error.
let nextCoreWebVitals = [];
try {
  const mod = require("eslint-config-next/core-web-vitals");
  const cfg = mod && mod.default ? mod.default : mod;
  nextCoreWebVitals = Array.isArray(cfg) ? cfg : [cfg];
} catch {
  nextCoreWebVitals = [];
}

export default defineConfig([
  // Keep the starter on the flat config export that actually runs under the pinned ESLint/Next toolchain.
  ...nextCoreWebVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
