const express = require("express");
const { exec } = require("child_process");

require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Simple in-memory lock to prevent concurrent runs
let isRunning = false;
let currentCommand = null;

// Utility to run shell commands
function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    // store current command for debugging / status
    currentCommand = cmd;
    const process = exec(cmd, (error, stdout, stderr) => {
      currentCommand = null;
      if (error) return reject(stderr || error.message);
      resolve(stdout);
    });

    // forward child process events to stdout for container logs (optional)
    process.stdout?.on(
      "data",
      (d) => process.stdout && console.log(d.toString())
    );
    process.stderr?.on(
      "data",
      (d) => process.stderr && console.error(d.toString())
    );
  });
}

// Middleware to check lock
function lockGuard(req, res, next) {
  if (isRunning) {
    return res
      .status(423)
      .json({ success: false, error: "Server is busy running a command" });
  }
  next();
}

// Route to test all versions
app.get("/all", lockGuard, async (req, res) => {
  isRunning = true;
  try {
    const cmd = "chmod +x ./run.sh && ./run.sh";
    const output = await runCommand(cmd);
    // Extract stable versions from the output
    const stableMatch = output.match(/Stable versions:(.*)/);
    const stableVersions = stableMatch
      ? stableMatch[1].trim().split(/\s+/).filter(Boolean)
      : [];

    res.json({ success: true, command: cmd, stableVersions });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  } finally {
    isRunning = false;
  }
});

// Route to test a specific version
app.get("/version/:version", lockGuard, async (req, res) => {
  const version = req.params.version;
  isRunning = true;
  try {
    const cmd = `export PACKAGE_VERSIONS=${version} && chmod +x ./run.sh && ./run.sh`;
    const output = await runCommand(cmd);

    // Extract stable versions from the output
    const stableMatch = output.match(/Stable versions:(.*)/);
    const stableVersions = stableMatch
      ? stableMatch[1].trim().split(/\s+/).filter(Boolean)
      : [];

    res.json({ success: true, command: cmd, stableVersions });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  } finally {
    isRunning = false;
  }
});

// Optional status endpoint to check if command is running
app.get("/status", (req, res) => {
  res.json({ running: isRunning, currentCommand });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
