import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/integration/**/*.spec.ts"],
    setupFiles: ["tests/integration/setup.ts"],
    globals: true,
    sequence: {
      concurrent: false,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/app.ts", "src/env.ts", "src/http/**/*.ts", "src/repositories/prisma/**/*.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
