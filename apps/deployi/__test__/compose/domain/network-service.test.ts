import { addDeployiNetworkToService } from "@deployi/server";
import { describe, expect, it } from "vitest";

describe("addDeployiNetworkToService", () => {
	it("should add network to an empty array", () => {
		const result = addDeployiNetworkToService([]);
		expect(result).toEqual(["deployi-network"]);
	});

	it("should not add duplicate network to an array", () => {
		const result = addDeployiNetworkToService(["deployi-network"]);
		expect(result).toEqual(["deployi-network"]);
	});

	it("should add network to an existing array with other networks", () => {
		const result = addDeployiNetworkToService(["other-network"]);
		expect(result).toEqual(["other-network", "deployi-network"]);
	});

	it("should add network to an object if networks is an object", () => {
		const result = addDeployiNetworkToService({ "other-network": {} });
		expect(result).toEqual({ "other-network": {}, "deployi-network": {} });
	});
});
