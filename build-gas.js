import fs from "fs";
import ts2gas from "ts2gas";

fs.readFile("dist-gas/index.js", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    process.exit(1);
  }
  const gsCode = ts2gas(data);

  fs.writeFile("dist-gas/index.gs", gsCode, (writeErr) => {
    if (writeErr) {
      console.error("Error writing file:", writeErr);
      process.exit(1);
    }
    console.log("Transpilation complete: dist-gas/index.gs created.");
  });
});
