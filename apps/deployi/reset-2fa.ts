import { findAdmin } from "@deployi/server";
import { db } from "@deployi/server/db";
import { users_temp } from "@deployi/server/db/schema";
import { eq } from "drizzle-orm";

(async () => {
	try {
		const result = await findAdmin();

		const update = await db
			.update(users_temp)
			.set({
				twoFactorEnabled: false,
			})
			.where(eq(users_temp.id, result.userId));

		if (update) {
			console.log("2FA reset successful");
		} else {
			console.log("Password reset failed");
		}

		process.exit(0);
	} catch (error) {
		console.log("Error resetting 2FA", error);
	}
})();
