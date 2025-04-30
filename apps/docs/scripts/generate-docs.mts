import * as path from "node:path";
import * as OpenAPI from "fumadocs-openapi";

export async function generateDocs() {
	// await rimraf("./content/docs/api", {
	// 	filter(v) {
	// 		return !v.endsWith("index.mdx") && !v.endsWith("meta.json");
	// 	},
	// });

	const demoRegex =
		/^---type-table-demo---\r?\n(?<content>.+)\r?\n---end---$/gm;

	await Promise.all([
		OpenAPI.generateFiles({
			input: ["./api.yaml"],
			output: "./content/docs/api",
			per: "operation",
			cwd: path.resolve(process.cwd(), ".."),
			name: (type, name) => "index",
		}).then(() => {
			console.log("OpenAPI done");
		}),
		// Typescript.generateFiles({
		//   input: ['./content/docs/**/*.model.mdx'],
		//   transformOutput(_, content) {
		//     return content.replace(demoRegex, '---type-table---\n$1\n---end---');
		//   },
		//   output: (file) =>
		//     path.resolve(
		//       path.dirname(file),
		//       `${path.basename(file).split('.')[0]}.mdx`,
		//     ),
		// }),
	]);

	console.log("Done");
}
