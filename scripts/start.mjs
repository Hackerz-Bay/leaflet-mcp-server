// Launches the MCP server, installing runtime dependencies first when they are missing or stale.
// node_modules is not committed, and MCP clients start the server with a bare `node` command, so this
// script is the install step. npm output goes to stderr because stdout carries the MCP protocol.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const stamp = join(root, "node_modules", ".hb-install-stamp");
// Two clients starting at once would each run `npm ci`, which deletes node_modules under the other.
const lock = join(root, ".hb-install.lock");
const lockOwner = join(lock, "pid");
const STALE_LOCK_MS = 10 * 60 * 1000;

const lockHash = createHash("sha256").update(readFileSync(join(root, "package-lock.json"))).digest("hex");
const isInstalled = () => existsSync(stamp) && readFileSync(stamp, "utf8").trim() === lockHash;

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === "EPERM";
  }
}

function lockIsStale() {
  let ageMs;
  try {
    ageMs = Date.now() - statSync(lock).mtimeMs;
  } catch {
    return false;
  }
  const owner = existsSync(lockOwner) ? Number(readFileSync(lockOwner, "utf8")) : null;
  // An MCP client that times out kills this process mid-install, so a dead owner must not block later starts.
  if (owner !== null && !isAlive(owner)) return true;
  return ageMs > STALE_LOCK_MS || (owner === null && ageMs > 5000);
}

async function acquireLock() {
  for (;;) {
    try {
      mkdirSync(lock);
      writeFileSync(lockOwner, String(process.pid));
      return;
    } catch (err) {
      if (err.code !== "EEXIST") throw err;
    }
    if (lockIsStale()) {
      rmSync(lock, { recursive: true, force: true });
      continue;
    }
    await sleep(500);
  }
}

function install() {
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
    return false;
  }
  writeFileSync(stamp, `${lockHash}\n`);
  return true;
}

if (!isInstalled()) {
  await acquireLock();
  let installed = true;
  try {
    if (!isInstalled()) installed = install();
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
  if (!installed) process.exit(1);
}

try {
  await import(pathToFileURL(join(root, "build", "index.js")).href);
} catch (err) {
  if (err?.code === "ERR_MODULE_NOT_FOUND") {
    rmSync(stamp, { force: true });
    console.error("leaflet-mcp-server: a dependency file is missing; it will be reinstalled on the next start.");
  }
  throw err;
}
