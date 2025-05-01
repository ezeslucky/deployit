import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeTraefik,
} from "@deployit/server/setup/traefik-setup";

import { setupDirectories } from "@deployit/server/setup/config-paths";
import { initializePostgres } from "@deployit/server/setup/postgres-setup";
import { initializeRedis } from "@deployit/server/setup/redis-setup";
import {
	initializeNetwork,
	initializeSwarm,
} from "@deployit/server/setup/setup";
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
