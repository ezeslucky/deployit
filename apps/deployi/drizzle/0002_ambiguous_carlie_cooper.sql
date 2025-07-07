-- ALTER TABLE "auth" ADD COLUMN "is2FAEnabled" boolean DEFAULT false NOT NULL;
ALTER TABLE auth ADD is_2fa_enabled bit NOT NULL DEFAULT 0;
