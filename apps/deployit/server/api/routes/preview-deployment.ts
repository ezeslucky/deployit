/* eslint-disable @typescript-eslint/ban-ts-comment */
import { apiFindAllByApplication } from "@/server/db/schema";
import {
	findApplicationById,
	findPreviewDeploymentById,
	findPreviewDeploymentsByApplicationId,
	removePreviewDeployment,
} from "../../../../../packages/server/src/index";
import { TRPCError } from "@trpc/server";
import { z } from "zod";


import { createTRCRouter, protectedProcedure } from "../trpc";

export const previewDeploymentRouter = createTRCRouter({
	all: protectedProcedure
		.input(apiFindAllByApplication)
		.query(async ({ input, ctx }) => {
			const application = await findApplicationById(input.applicationId);
			if (
				application.project.organizationId !== ctx.session.activeOrganizationId
			) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to access this application",
				});
			}
			return await findPreviewDeploymentsByApplicationId(input.applicationId);
		}),
	delete: protectedProcedure
		.input(z.object({ previewDeploymentId: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const previewDeployment = await findPreviewDeploymentById(
				input.previewDeploymentId,
			);
			if (
				previewDeployment.application.project.organizationId !==
				ctx.session.activeOrganizationId
			) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to delete this preview deployment",
				});
			}
			await removePreviewDeployment(input.previewDeploymentId);
			return true;
		}),
	one: protectedProcedure
		.input(z.object({ previewDeploymentId: z.string() }))
		.query(async ({ input, ctx }) => {
			const previewDeployment = await findPreviewDeploymentById(
				input.previewDeploymentId,
			);
			if (
				previewDeployment.application.project.organizationId !==
				ctx.session.activeOrganizationId
			) {
				throw new TRPCError({
					code: "UNAUTHORIZED",
					message: "You are not authorized to access this preview deployment",
				});
			}
			return previewDeployment;
		}),
});
