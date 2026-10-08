import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const root = new URL("../..", import.meta.url);

export default defineConfig({
  testDir: ".",
  use: { baseURL: "http://127.0.0.1:7792" },
  webServer: {
    command: "python3 -m http.server 7792 --bind 127.0.0.1 --directory .",
    cwd: fileURLToPath(root),
    url: "http://127.0.0.1:7792",
    reuseExistingServer: false
  }
});
