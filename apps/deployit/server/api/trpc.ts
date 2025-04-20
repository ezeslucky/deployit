import { db } from "@/server/db";
import { validateRequest } from "@dokploy/server/lib/auth";
import type { OpenApiMeta } from "@dokploy/trpc-openapi";
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