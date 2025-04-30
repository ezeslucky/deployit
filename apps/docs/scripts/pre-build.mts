import { generateDocs } from "./generate-docs.mjs";
async function main() {
	await Promise.all([generateDocs()]);
	console.log("Pre build script completed");
}

await main().catch((e) => {
	console.error("Failed to run pre build script", e);
});
