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
    // Local agent/tooling scratch dirs. None of this is app source, and
    // .claude/worktrees/ holds whole checkouts of this repo (each with its
    // own .next/), so leaving it in drowns real src/ findings in tens of
    // thousands of problems. Keep in sync with .gitignore.
    ".claude/**",
    ".superpowers/**",
    ".playwright-mcp/**",
  ]),
]);

export default eslintConfig;
