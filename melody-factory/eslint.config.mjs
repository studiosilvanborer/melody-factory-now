import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build-Ergebnisse: `vercel build` und `sanity build`. Fremder,
    // minifizierter Code, beides nicht im Git.
    ".vercel/**",
    "dist/**",
    // Von `npm run typegen` erzeugt – an diesen Dateien gibt es nichts
    // zu beanstanden, was sich von Hand beheben liesse.
    "sanity.types.ts",
    "schema.json",
  ]),
]);

export default eslintConfig;
