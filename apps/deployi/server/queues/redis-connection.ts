import type { ConnectionOptions } from "bullmq";

export const redisConfig: ConnectionOptions = {
	host:
		process.env.NODE_ENV === "production"
			? process.env.REDIS_HOST || "deployi-redis"
			: "127.0.0.1",
};
