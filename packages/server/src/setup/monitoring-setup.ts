import { findServerById } from "@deployit/server/services/server";
import type { ContainerCreateOptions } from "dockerode";
import { IS_CLOUD } from "../constants";
import { findUserById } from "../services/admin";
import { getdeployitImageTag } from "../services/settings";
import { pullImage, pullRemoteImage } from "../utils/docker/utils";
import { execAsync, execAsyncRemote } from "../utils/process/execAsync";
import { getRemoteDocker } from "../utils/servers/remote-docker";

export const setupMonitoring = async (serverId: string) => {
	const server = await findServerById(serverId);

	const containerName = "deployit-monitoring";
	let imageName = "deployit/monitoring:latest";

	if (
		(getdeployitImageTag() !== "latest" ||
			process.env.NODE_ENV === "development") &&
		!IS_CLOUD
	) {
		imageName = "deployit/monitoring:canary";
	}

	const settings: ContainerCreateOptions = {
		name: containerName,
		Env: [`METRICS_CONFIG=${JSON.stringify(server?.metricsConfig)}`],
		Image: imageName,
		HostConfig: {
			// Memory: 100 * 1024 * 1024, // 100MB en bytes
			// PidMode: "host",
			// CapAdd: ["NET_ADMIN", "SYS_ADMIN"],
			// Privileged: true,
			PortBindings: {
				[`${server.metricsConfig.server.port}/tcp`]: [
					{
						HostPort: server.metricsConfig.server.port.toString(),
					},
				],
			},
			Binds: [
				"/var/run/docker.sock:/var/run/docker.sock:ro",
				"/sys:/host/sys:ro",
				"/etc/os-release:/etc/os-release:ro",
				"/proc:/host/proc:ro",
				"/etc/deployit/monitoring/monitoring.db:/app/monitoring.db",
			],
			NetworkMode: "host",
		},
		ExposedPorts: {
			[`${server.metricsConfig.server.port}/tcp`]: {},
		},
	};
	const docker = await getRemoteDocker(serverId);
	try {
		await execAsyncRemote(
			serverId,
			"mkdir -p /etc/deployit/monitoring && touch /etc/deployit/monitoring/monitoring.db",
		);
		if (serverId) {
			await pullRemoteImage(imageName, serverId);
		}

		// Check if container exists
		const container = docker.getContainer(containerName);
		try {
			await container.inspect();
			await container.remove({ force: true });
			console.log("Removed existing container");
		} catch (_error) {
			// Container doesn't exist, continue
		}

		await docker.createContainer(settings);
		const newContainer = docker.getContainer(containerName);
		await newContainer.start();

		console.log("Monitoring Started ");
	} catch (error) {
		console.log("Monitoring Not Found: Starting ", error);
	}
};

export const setupWebMonitoring = async (userId: string) => {
	const user = await findUserById(userId);

	const containerName = "deployit-monitoring";
	let imageName = "deployit/monitoring:latest";

	if (
		(getdeployitImageTag() !== "latest" ||
			process.env.NODE_ENV === "development") &&
		!IS_CLOUD
	) {
		imageName = "deployit/monitoring:canary";
	}

	const settings: ContainerCreateOptions = {
		name: containerName,
		Env: [`METRICS_CONFIG=${JSON.stringify(user?.metricsConfig)}`],
		Image: imageName,
		HostConfig: {
			// Memory: 100 * 1024 * 1024, // 100MB en bytes
			// PidMode: "host",
			// CapAdd: ["NET_ADMIN", "SYS_ADMIN"],
			// Privileged: true,
			PortBindings: {
				[`${user?.metricsConfig?.server?.port}/tcp`]: [
					{
						HostPort: user?.metricsConfig?.server?.port.toString(),
					},
				],
			},
			Binds: [
				"/var/run/docker.sock:/var/run/docker.sock:ro",
				"/sys:/host/sys:ro",
				"/etc/os-release:/etc/os-release:ro",
				"/proc:/host/proc:ro",
				"/etc/deployit/monitoring/monitoring.db:/app/monitoring.db",
			],
			// NetworkMode: "host",
		},
		ExposedPorts: {
			[`${user?.metricsConfig?.server?.port}/tcp`]: {},
		},
	};
	const docker = await getRemoteDocker();
	try {
		await execAsync(
			"mkdir -p /etc/deployit/monitoring && touch /etc/deployit/monitoring/monitoring.db",
		);
		await pullImage(imageName);

		const container = docker.getContainer(containerName);
		try {
			await container.inspect();
			await container.remove({ force: true });
			console.log("Removed existing container");
		} catch (_error) {}

		await docker.createContainer(settings);
		const newContainer = docker.getContainer(containerName);
		await newContainer.start();

		console.log("Monitoring Started ");
	} catch (error) {
		console.log("Monitoring Not Found: Starting ", error);
	}
};
