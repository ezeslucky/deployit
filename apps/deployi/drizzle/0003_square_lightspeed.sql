-- ALTER TABLE "user" ADD COLUMN "canAccessToDocker" boolean DEFAULT false NOT NULL;
ALTER TABLE [user] ADD canAccessToDocker bit NOT NULL DEFAULT 0;
