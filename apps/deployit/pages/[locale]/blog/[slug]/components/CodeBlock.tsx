"use client";

import { CopyButton } from "@/components/ui/copy-button";
import * as babel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import * as yaml from "prettier/plugins/yaml";
import * as prettier from "prettier/standalone";
import { type JSX, useLayoutEffect, useState } from "react";
import type { BundledLanguage } from "shiki/bundle/web";
import { highlight } from "./shared";

interface CodeBlockProps {
	code: string;
	lang: BundledLanguage;
	initial?: JSX.Element;
}

async function formatCode(code: string, lang: string) {
	try {
		let parser: string;
		let plugins = [];

		// Select parser and plugins based on language
		switch (lang.toLowerCase()) {
			case "yaml":
			case "yml":
				parser = "yaml";
				plugins = [yaml];
				break;
			case "javascript":
			case "typescript":
			case "jsx":
			case "tsx":
				parser = "babel-ts";
				plugins = [babel, estree];
				break;
			default:
				// For unsupported languages, return the original code
				return code;
		}

		console.log(`Formatting ${lang} with parser:`, parser);

		const formatted = await prettier.format(code, {
			parser,
			plugins,
			semi: true,
			singleQuote: true,
			tabWidth: 2,
			useTabs: false,
			printWidth: 120,
		});

		console.log("Formatted code:", formatted);
		return formatted;
	} catch (error) {
		console.error("Error formatting code:", error);
		return code; // Return original code if there's an error
	}
}

export function CodeBlock({ code, lang, initial }: CodeBlockProps) {
	const [nodes, setNodes] = useState<JSX.Element | undefined>(initial);
	const [formattedCode, setFormattedCode] = useState(code);

	useLayoutEffect(() => {
		async function formatAndHighlight() {
			try {
				console.log("Original code:", code);
				console.log("Language:", lang);
				const formatted = await formatCode(code, lang);
				setFormattedCode(formatted);

				// Then highlight the formatted code
				const highlighted = await highlight(formatted, lang);
				setNodes(highlighted);
			} catch (error) {
				console.error("Error in formatAndHighlight:", error);
				// If formatting fails, try to highlight the original code
				const highlighted = await highlight(code, lang);
				setNodes(highlighted);
			}
		}

		void formatAndHighlight();
	}, [code, lang]);

	if (!nodes) {
		return (
			<div className="group relative">
				<div className="text-sm p-4 rounded-lg bg-[#18191F] overflow-auto animate-pulse">
					<div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
					<div className="h-4 bg-gray-700 rounded w-1/2" />
				</div>
			</div>
		);
	}

	return (
		<div className="group relative">
			<CopyButton text={formattedCode} />
			<div className="text-sm p-4 rounded-lg bg-[#18191F] overflow-auto">
				{nodes}
			</div>
		</div>
	);
}
