import { adddeployitNetworkToRoot } from "../../../../../packages/server/src/index";
import { describe, expect, it } from "vitest";

describe("adddeployitNetworkToRoot", () => {
	it("should create network object if networks is undefined", () => {
		const result = adddeployitNetworkToRoot(undefined);
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should add network to an empty object", () => {
		const result = adddeployitNetworkToRoot({});
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should not modify existing network configuration", () => {
		const existing = { "deployit-network": { external: false } };
		const result = adddeployitNetworkToRoot(existing);
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should add network alongside existing networks", () => {
		const existing = { "other-network": { external: true } };
		const result = adddeployitNetworkToRoot(existing);
		expect(result).toEqual({
			"other-network": { external: true },
			"deployit-network": { external: true },
		});
	});
});
