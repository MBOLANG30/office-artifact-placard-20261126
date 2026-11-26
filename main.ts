// Office Artifacts: The One-Line Placard Contest
// A single museum placard for an ordinary office object, written as if the
// object were an ancient artifact dug from a lost civilisation.
//
// The entry is one fixed line (the winning placard, chosen in this session
// from ten candidates). The program validates it against the house gate
// (1-180 characters, one line, no leading/trailing whitespace) and writes it
// to entry.txt with no trailing newline, then reads the file back and refuses
// to finish unless the bytes on disk match the entry exactly.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning placard: a stapler recast as a ritual binder of loose leaves.
const ENTRY =
  "Stapler, c. 2019. Forged steel, 47% rust. Ritual binder of loose leaves; priests pressed its jaws to marry two sheets forever. Donated by Accounts, who never forgave it.";

// The house gate: 1-180 characters, a single line, not only whitespace.
// The gate counts characters, so the check below uses the string length,
// not the byte length (the placard is plain ASCII here, so both agree).
if (ENTRY.length < 1 || ENTRY.length > 180) {
  throw new Error(`entry must be 1-180 characters, got ${ENTRY.length}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

// The grader mounts the output directory; create it if missing, never
// delete it (removing a mounted directory fails with EBUSY).
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });

const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back and refuse to finish unless the file is byte-identical.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt on disk does not match the entry");
}

console.log(`wrote ${outPath} (${ENTRY.length} characters)`);
