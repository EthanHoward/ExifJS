import * as fs from "fs";
import * as path from "path";

const logArray: string[] = [];
const logFile = path.resolve(process.cwd(), "dist", "debug.log");

process.on("exit", () => {
  if (logArray.length === 0) return;

  try {
    fs.appendFileSync(logFile, logArray.join("\n") + "\n", { encoding: "utf-8" });
    console.log(`Debug log written to ${logFile}`);
  } catch (err) {
    console.error("Failed to write debug log:", err);
  }
});

const log = (lm: string) => {
  if (process.env.EXIFJS_DEVELOPMENT_LOGGING !== "1") return;

  const timestamped = `[${new Date().toISOString()}] ${lm}`;
  logArray.push(timestamped);

  console.debug(timestamped);
};

export default log;
