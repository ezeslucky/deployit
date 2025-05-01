import { adddeployitNetworkToService } from "@deployit/server";
import { describe, expect, it } from "vitest";

describe("adddeployitNetworkToService", () => {
	it("should add network to an empty array", () => {
		const result = adddeployitNetworkToService([]);
		expect(result).toEqual(["deployit-network"]);
	});

	it("should not add duplicate network to an array", () => {
		const result = adddeployitNetworkToService(["deployit-network"]);
		expect(result).toEqual(["deployit-network"]);
	});

	it("should add network to an existing array with other networks", () => {
		const result = adddeployitNetworkToService(["other-network"]);
		expect(result).toEqual(["other-network", "deployit-network"]);
	});

	it("should add network to an object if networks is an object", () => {
		const result = adddeployitNetworkToService({ "other-network": {} });
		expect(result).toEqual({ "other-network": {}, "deployit-network": {} });
	});
});
