// Launches the MCP server, installing runtime dependencies first when they are missing or stale.
// node_modules is not committed, and MCP clients start the server with a bare `node` command, so this
// script is the install step. npm output goes to stderr because stdout carries the MCP protocol.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const lockfile = join(root, "package-lock.json");
const stamp = join(root, "node_modules", ".hb-install-stamp");

const lockHash = createHash("sha256").update(readFileSync(lockfile)).digest("hex");
const installed = existsSync(stamp) ? readFileSync(stamp, "utf8").trim() : null;

if (installed !== lockHash) {
  console.error("leaflet-mcp-server: installing dependencies (npm ci --omit=dev)...");
  // --ignore-scripts skips `prepare` (tsc): build/ is committed and TypeScript is a dev dependency.
  const result = spawnSync("npm", ["ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"], {
    cwd: root,
    stdio: ["ignore", 2, 2],
    // npm is a .cmd shim on Windows, which Node only spawns through a shell.
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    console.error(`leaflet-mcp-server: npm ci failed (exit ${result.status ?? result.error?.message}); run it in ${root}`);
    process.exit(1);
  }
  writeFileSync(stamp, `${lockHash}\n`);
}

await import(pathToFileURL(join(root, "build", "index.js")).href);
