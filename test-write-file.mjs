import fs from "fs";
import path from "path";

const outputFile = path.resolve("env-keys.json");
const data = ["TEST_KEY1", "TEST_KEY2"];

console.log("Writing test file...");
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
console.log(`File written at: ${outputFile}`);
