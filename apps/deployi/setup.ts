import {
	createDefaultMiddlewares,
	createDefaultServerTraefikConfig,
	createDefaultTraefikConfig,
	initializeTraefik,
} from "@deployi/server";

import { setupDirectories } from "@deployi/server";
import { initializePostgres } from "@deployi/server";
import { initializeRedis } from "@deployi/server";
import {
	initializeNetwork,
	initializeSwarm,
} from "@deployi/server";
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
		console.error("Error in deployi setup", e);
	}
})();
