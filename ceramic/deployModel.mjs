import { readFile, writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";

// Connect to the local Ceramic node
const ceramic = new CeramicClient("https://gateway-clay.ceramic.network");

// Load and create a manager for the model
const bytes = await readFile(new URL("model.json", import.meta.url));
const manager = ModelManager.fromJSON({
  ceramic,
  model: JSON.parse(bytes.toString()),
});

// Write model to JSON file
const aliases = await manager.deploy();
await writeFile(
  new URL("../__generated__/aliases.js", import.meta.url),
  `export const aliases = ${JSON.stringify(aliases)}`
);

console.log(
  "Model aliases written to /__generated__/aliases.js file:",
  aliases
);
