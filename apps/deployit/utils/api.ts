
import type { AppRouter } from "../server/api/root";
import {
	createWSClient,
	httpBatchLink,
	splitLink,
	wsLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import superjson from "superjson";

const getBaseUrl = () => {
	if (typeof window !== "undefined") return ""; // browser should use relative url
	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const getWsUrl = () => {
	if (typeof window === "undefined") return null;

	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
	const host = window.location.host;

	return `${protocol}${host}/drawer-logs`;
};

const wsClient =
	typeof window !== "undefined"
		? createWSClient({
				url: getWsUrl() || "",
			})
		: null;

/** A set of type-safe react-query hooks for your tRPC API. */
export const api = createTRPCNext<AppRouter>({
	config() {
		return {
			/**
			 * Transformer used for data de-serialization from the server.
			 *
			 * @see https://trpc.io/docs/data-transformers
			 */
			transformer: superjson,

			/**
			 * Links used to determine request flow from client to server.
			 *
			 * @see https://trpc.io/docs/links
			 */
			links: [
				splitLink({
					condition: (op) => op.type === "subscription",
					true: wsLink({
						client: wsClient!,
					}),
					false: splitLink({
						condition: (op) => op.input instanceof FormData,
						true: experimental_formDataLink({
							url: `${getBaseUrl()}/api/trpc`,
						}),
						false: httpBatchLink({
							url: `${getBaseUrl()}/api/trpc`,
						}),
					}),
				}),
			],
		};
	},
	/**
	 * Whether tRPC should await queries when server rendering pages.
	 *
	 * @see https://trpc.io/docs/nextjs#ssr-boolean-default-false
	 */
	ssr: false,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
