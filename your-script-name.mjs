import fs from "fs";
import path from "path";

const envFilePath = path.resolve(".env");

function extractEnvKeyValues(envPath) {
  if (!fs.existsSync(envPath)) {
    console.error(`.env file not found at ${envPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");

  // Split by lines but also handle line continuations ending with \\
  const lines = content.split(/\r?\n/);

  const envVars = {};
  let currentKey = null;
  let currentValue = "";

  lines.forEach((line) => {
    line = line.trim();

    // Skip empty lines or comments
    if (!line || line.startsWith("#")) return;

    // If currently reading a multiline value
    if (currentKey) {
      currentValue += "\n" + line.replace(/\\$/, ""); // Remove trailing backslash for multiline

      // If this line ends WITHOUT a backslash, finish multiline value
      if (!line.endsWith("\\")) {
        envVars[currentKey] = currentValue.trim();
        currentKey = null;
        currentValue = "";
      }
      return;
    }

    // Normal key=value line
    const keyValMatch = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (keyValMatch) {
      const [, key, value] = keyValMatch;

      // Check if value is multiline (ends with backslash)
      if (value.endsWith("\\")) {
        currentKey = key;
        currentValue = value.replace(/\\$/, "");
      } else {
        envVars[key] = value.trim();
      }
    }
  });

  return envVars;
}

const envVars = extractEnvKeyValues(envFilePath);

console.log("Extracted env vars and their values:");
console.log(envVars);
