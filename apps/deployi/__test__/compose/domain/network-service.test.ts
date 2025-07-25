import { addDokployNetworkToService } from "@deployi/server";
import { describe, expect, it } from "vitest";

describe("addDokployNetworkToService", () => {
	it("should add network to an empty array", () => {
		const result = addDokployNetworkToService([]);
		expect(result).toEqual(["deployi-network"]);
	});

	it("should not add duplicate network to an array", () => {
		const result = addDokployNetworkToService(["deployi-network"]);
		expect(result).toEqual(["deployi-network"]);
	});

	it("should add network to an existing array with other networks", () => {
		const result = addDokployNetworkToService(["other-network"]);
		expect(result).toEqual(["other-network", "deployi-network"]);
	});

	it("should add network to an object if networks is an object", () => {
		const result = addDokployNetworkToService({ "other-network": {} });
		expect(result).toEqual({ "other-network": {}, "deployi-network": {} });
	});
});
