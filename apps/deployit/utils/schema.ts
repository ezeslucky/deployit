/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from "zod";
import { zfd } from "zod-form-data";

if (typeof window === "undefined") {
	void (async () => {
		//@ts-ignore
		const undici = await import("undici");
		globalThis.File = undici.File as any;
		// @ts-ignore
		globalThis.FileList = undici.FileList as any;
	})();
}

export const uploadFileSchema = zfd.formData({
	applicationId: z.string().optional(),
	zip: zfd.file(),
	dropBuildPath: z.string().optional(),
});

export type UploadFile = z.infer<typeof uploadFileSchema>;
