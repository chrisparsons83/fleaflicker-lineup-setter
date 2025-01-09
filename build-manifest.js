// build-manifest.js

const fs = require("fs");
const path = require("path");

// Determine the target browser from the environment variable (default to Chrome)
const browser = process.env.BROWSER || "chrome";

// Define the source and destination manifest file paths
const manifestFile = `manifest.${browser}.json`;
const srcPath = path.join(__dirname, "src", "manifests", manifestFile);
const destPath = path.join(__dirname, "dist", "manifest.json");

// Check if the source manifest file exists
if (!fs.existsSync(srcPath)) {
  console.error(`Error: ${manifestFile} not found in src/manifests.`);
  process.exit(1);
}

// Copy the source manifest to the destination path
fs.copyFileSync(srcPath, destPath);
console.log(`Successfully copied ${manifestFile} to dist/manifest.json.`);
