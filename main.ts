// One-Line Resignation Letter entry: prints a single original resignation
// line to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Dear boss, I resign — after three years of being 'part of the family,' I have decided to run away from home.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const chars = [...LINE].length;
if (LINE.trim().length === 0 || chars < 1 || chars > 200) {
  console.error(`entry line must be 1-200 characters, got ${chars}`);
  process.exit(1);
}
// One line means one line: no carriage returns or newlines hiding inside.
if (/[\r\n]/.test(LINE)) {
  console.error("entry line must not contain a line break");
  process.exit(1);
}
// Count bytes as well as characters so a multi-byte line cannot pass the
// character gate and still exceed the size limit.
const bytes = Buffer.byteLength(LINE, "utf8");
if (bytes > 800) {
  console.error(`entry line is ${bytes} UTF-8 bytes, over the 800-byte cap`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Read the file back and confirm what landed on disk is exactly the line
// we validated, so a truncated or altered write can never pass silently.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== LINE) {
  console.error("verification failed: bytes on disk do not match the entry line");
  process.exit(1);
}
console.log(`wrote ${chars} characters to ${outPath} (verified)`);
