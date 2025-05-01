/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "../db/index";
import { validateRequest } from "../../../../packages/server/src/lib/auth";
import type { OpenApiMeta } from "@deployit/trpc-openapi";
import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import {
	experimental_createMemoryUploadHandler,
	experimental_isMultipartFormDataRequest,
	experimental_parseMultipartFormData,
} from "@trpc/server/adapters/node-http/content-type/form-data";
import type { Session, User } from "better-auth";
import superjson from "superjson";
import { ZodError } from "zod";


interface CreateContextOptions{
	user: (User & {rol: "number" | "admin" | "owner";
		ownerId: string
	}) | null
	session: (Session & {activeOrganizationId: string}) | null
	req: CreateNextContextOptions["req"]
	res: CreateNextContextOptions["res"]
}


const createInnerTRPCContext = (opts: CreateContextOptions) => {
	return {
		session: opts.session,
		db,
		req: opts.req,
		res: opts.res,
		user: opts.user,
	}
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
	const {req, res} = opts

	const {session, user }  = await validateRequest(req)

	return createInnerTRPCContext({
		req, res,
		//@ts-expect-error

		session: session ? {
			...session,
			activeOrganizationId: session.activeOrganizationId || "",

		} : null,
		//@ts-expect-error

		user : user ? {
			...user,
			email: user.email,
			rol: user.role as "owner" | "member" | "admin",
			id: user.id,
			ownerId: user.ownerId,
		}: null
	})
}

const t = initTRPC.meta<OpenApiMeta>().context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({shape, error}){
		return{
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		}
	}
})

export const createTRCRouter = t.router
export const publicProcedure = t.procedure

export const  protectedProcedure = t.procedure.use(({ctx, next}) => {
	if(!ctx.session || !ctx.user) {
		throw new TRPCError({ code: "UNAUTHORIZED"})
	}
	 return next({
		ctx:{
			session: ctx.session,
			user: ctx.user,
		}
	 })
})

export const uploadProcedure = async (opts:any) =>{
	if(!experimental_isMultipartFormDataRequest(opts.ctx.req)){
		return opts.next()
	}

	const formData = await experimental_parseMultipartFormData(opts.ctx.req,
		experimental_createMemoryUploadHandler({
			maxPartSize : 1024 * 1024 * 1024 * 2
		})
	)
	return opts.next({
		rawInput: formData,
	})
}

export const cliProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.user || ctx.user.rol !== "owner") {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			
			session: ctx.session,
			user: ctx.user,
			
		},
	});
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session || !ctx.user || ctx.user.rol !== "owner") {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			
			session: ctx.session,
			user: ctx.user,
			
		},
	});
});
