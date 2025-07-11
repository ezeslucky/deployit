import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeTraefik,
} from "@deployi/server/setup/traefik-setup";

import { setupDirectories } from "@deployi/server/setup/config-paths";
import { initializePostgres } from "@deployi/server/setup/postgres-setup";
import { initializeRedis } from "@deployi/server/setup/redis-setup";
import {
	initializeNetwork,
	initializeSwarm,
} from "@deployi/server/setup/setup";
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
		console.error("Error in dokploy setup", e);
	}
})();
