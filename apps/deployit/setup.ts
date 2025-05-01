import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeTraefik,
} from "../../packages/server/src/setup/traefik-setup";

import { setupDirectories } from "../../packages/server/src/setup/config-paths";
import { initializePostgres } from "../../packages/server/src/setup/postgres-setup";
import { initializeRedis } from "../../packages/server/src/setup/redis-setup";
import {
	initializeNetwork,
	initializeSwarm,
} from "../../packages/server/src/setup/setup";
(async () => {
	try {
		setupDirectories();
		createDefaultMiddlewares();
		await initializeSwarm();
		await initializeNetwork();
		createDefaultTraefikConfig();
		createDefaultServerTraefikConfig();
		await initializeTraefik();
		await initializeRedis();
		await initializePostgres();
	} catch (e) {
		console.error("Error in deployit setup", e);
	}
})();
