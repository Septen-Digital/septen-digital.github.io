import { rm } from "node:fs/promises";

await rm(".lighthouseci", { force: true, recursive: true });
