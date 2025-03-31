import { KvAdmin } from "./KvAdmin.ts";
import { type Context, Hono } from "hono";

const kvAdmin = await KvAdmin.getInstance("../kv.sqlite3");

const app = new Hono();

app.get(
  "/",
  (c: Context) => c.html(`<img src="/files/avatar.png">`),
);

app.get(
  "/files/avatar.png",
  async (c: Context) => await kvAdmin.file(c, c.req.path.split("/").slice(1)),
);

Deno.serve(app.fetch);
