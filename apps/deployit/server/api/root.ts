import { createTRCRouter } from "../api/trpc";
import { adminRouter } from "./routes/admin";
import { aiRouter } from "./routes/ai";
import { applicationRouter } from "./routes/application";
import { backupRouter } from "./routes/backup";
import { bitbucketRouter } from "./routes/bitbucket";
import { certificateRouter } from "./routes/certificate";
import { clusterRouter } from "./routes/cluster";
import { composeRouter } from "./routes/compose";
import { deploymentRouter } from "./routes/deployment";
import { destinationRouter } from "./routes/destination";
import { dockerRouter } from "./routes/docker";
import { domainRouter } from "./routes/domain";
import { gitProviderRouter } from "./routes/git-provider";
import { giteaRouter } from "./routes/gitea";
import { githubRouter } from "./routes/github";
import { gitlabRouter } from "./routes/gitlab";
import { mariadbRouter } from "./routes/mariadb";
import { mongoRouter } from "./routes/mongo";
import { mountRouter } from "./routes/mount";
import { mysqlRouter } from "./routes/mysql";
import { notificationRouter } from "./routes/notification";
import { organizationRouter } from "./routes/organization";
import { portRouter } from "./routes/port";
import { postgresRouter } from "./routes/postgres";
import { previewDeploymentRouter } from "./routes/preview-deployment";
import { projectRouter } from "./routes/project";
import { redirectsRouter } from "./routes/redirects";
import { redisRouter } from "./routes/redis";
import { registryRouter } from "./routes/registry";
import { securityRouter } from "./routes/security";
import { serverRouter } from "./routes/server";
import { settingsRouter } from "./routes/settings";
import { sshRouter } from "./routes/ssh-key";
import { stripeRouter } from "./routes/stripe";
import { swarmRouter } from "./routes/swarm";
import { userRouter } from "./routes/user";
/**
 * This is the primary router for your server.
 *
 * All routes added in /api/routes should be manually added here.
 */

export const appRouter = createTRCRouter({
	admin: adminRouter,
	docker: dockerRouter,
	project: projectRouter,
	application: applicationRouter,
	mysql: mysqlRouter,
	postgres: postgresRouter,
	redis: redisRouter,
	mongo: mongoRouter,
	mariadb: mariadbRouter,
	compose: composeRouter,
	user: userRouter,
	domain: domainRouter,
	destination: destinationRouter,
	backup: backupRouter,
	deployment: deploymentRouter,
	previewDeployment: previewDeploymentRouter,
	mounts: mountRouter,
	certificates: certificateRouter,
	settings: settingsRouter,
	security: securityRouter,
	redirects: redirectsRouter,
	port: portRouter,
	registry: registryRouter,
	cluster: clusterRouter,
	notification: notificationRouter,
	sshKey: sshRouter,
	gitProvider: gitProviderRouter,
	gitea: giteaRouter,
	bitbucket: bitbucketRouter,
	gitlab: gitlabRouter,
	github: githubRouter,
	server: serverRouter,
	stripe: stripeRouter,
	swarm: swarmRouter,
	ai: aiRouter,
	organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
