import {
	cleanUpDockerBuilder,
	cleanUpSystemPrune,
	cleanUpUnusedImages,
	findBackupById,
	findServerById,
	keepLatestNBackups,
	runMariadbBackup,
	runMongoBackup,
	runMySqlBackup,
	runPostgresBackup,
} from "@deployit/server";
import { db } from "@deployit/server/dist/db";
import { backups, server } from "@deployit/server/dist/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger.js";
import { scheduleJob } from "./queue.js";
import type { QueueJob } from "./schema.js";

export const runJobs = async (job: QueueJob) => {
	try {
		if (job.type === "backup") {
			const { backupId } = job;
			const backup = await findBackupById(backupId);
			const { databaseType, postgres, mysql, mongo, mariadb } = backup;

			if (databaseType === "postgres" && postgres) {
				const server = await findServerById(postgres.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runPostgresBackup(postgres, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mysql" && mysql) {
				const server = await findServerById(mysql.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMySqlBackup(mysql, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mongo" && mongo) {
				const server = await findServerById(mongo.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMongoBackup(mongo, backup);
				await keepLatestNBackups(backup, server.serverId);
			} else if (databaseType === "mariadb" && mariadb) {
				const server = await findServerById(mariadb.serverId as string);
				if (server.serverStatus === "inactive") {
					logger.info("Server is inactive");
					return;
				}
				await runMariadbBackup(mariadb, backup);
				await keepLatestNBackups(backup, server.serverId);
			}
		}
		if (job.type === "server") {
			const { serverId } = job;
			const server = await findServerById(serverId);
			if (server.serverStatus === "inactive") {
				logger.info("Server is inactive");
				return;
			}
			await cleanUpUnusedImages(serverId);
			await cleanUpDockerBuilder(serverId);
			await cleanUpSystemPrune(serverId);
		}
	} catch (error) {
		logger.error(error);
	}

	return true;
};

export const initializeJobs = async () => {
	logger.info("Setting up Jobs....");

	const servers = await db.query.server.findMany({
		where: eq(server.enableDockerCleanup, true),
	});

	for (const server of servers) {
		const { serverId } = server;
		scheduleJob({
			serverId,
			type: "server",
			cronSchedule: "0 0 * * *",
		});
	}

	logger.info({ Quantity: servers.length }, "Servers Initialized");

	const backupsResult = await db.query.backups.findMany({
		where: eq(backups.enabled, true),
		with: {
			mariadb: true,
			mysql: true,
			postgres: true,
			mongo: true,
		},
	});

	for (const backup of backupsResult) {
		scheduleJob({
			backupId: backup.backupId,
			type: "backup",
			cronSchedule: backup.schedule,
		});
	}
	logger.info({ Quantity: backupsResult.length }, "Backups Initialized");
};
