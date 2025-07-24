import { addDokployNetworkToRoot } from "@deployi/server";
import { describe, expect, it } from "vitest";

describe("addDokployNetworkToRoot", () => {
	it("should create network object if networks is undefined", () => {
		const result = addDokployNetworkToRoot(undefined);
		expect(result).toEqual({ "deployi-network": { external: true } });
	});

	it("should add network to an empty object", () => {
		const result = addDokployNetworkToRoot({});
		expect(result).toEqual({ "deployi-network": { external: true } });
	});

	it("should not modify existing network configuration", () => {
		const existing = { "deployi-network": { external: false } };
		const result = addDokployNetworkToRoot(existing);
		expect(result).toEqual({ "deployi-network": { external: true } });
	});

	it("should add network alongside existing networks", () => {
		const existing = { "other-network": { external: true } };
		const result = addDokployNetworkToRoot(existing);
		expect(result).toEqual({
			"other-network": { external: true },
			"deployi-network": { external: true },
		});
	});
});
