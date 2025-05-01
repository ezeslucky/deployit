/* eslint-disable @typescript-eslint/ban-ts-comment */
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { validateRequest } from "../../../../packages/server/src/index";
import { createOpenApiNextHandler } from "@deployit/trpc-openapi";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { session, user } = await validateRequest(req);

	if (!user || !session) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	// @ts-ignore
	return createOpenApiNextHandler({
		router: appRouter,
		createContext: createTRPCContext,
	})(req, res);
};

export default handler;
