import { serve } from "@hono/node-server";
import { Hono } from "hono";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const app = new Hono();

await delay(5000);

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

app.get("/health", (c) => {
	return c.json("ok", 200);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
