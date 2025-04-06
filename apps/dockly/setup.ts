import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeTraefik,
} from "@dockly/server/setup/traefik-setup";

import { setupDirectories } from "@dockly/server/setup/config-paths";
import { initializePostgres } from "@dockly/server/setup/postgres-setup";
import { initializeRedis } from "@dockly/server/setup/redis-setup";
import {
	initializeNetwork,
	initializeSwarm,
} from "@dockly/server/setup/setup";
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
