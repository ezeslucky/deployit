import { addDeployitNetworkToRoot } from "@deployit/server";
import { describe, expect, it } from "vitest";

describe("addDeployitNetworkToRoot", () => {
	it("should create network object if networks is undefined", () => {
		const result = addDeployitNetworkToRoot(undefined);
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should add network to an empty object", () => {
		const result = addDeployitNetworkToRoot({});
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should not modify existing network configuration", () => {
		const existing = { "deployit-network": { external: false } };
		const result = addDeployitNetworkToRoot(existing);
		expect(result).toEqual({ "deployit-network": { external: true } });
	});

	it("should add network alongside existing networks", () => {
		const existing = { "other-network": { external: true } };
		const result = addDeployitNetworkToRoot(existing);
		expect(result).toEqual({
			"other-network": { external: true },
			"deployit-network": { external: true },
		});
	});
});
