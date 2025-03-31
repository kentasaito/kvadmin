import { KvAdmin } from "./KvAdmin.ts";
import { type Context, Hono } from "hono";

const kvAdmin = await KvAdmin.getInstance("../kv.sqlite3");

const app = new Hono();

app.get(
  "/",
  (c: Context) => c.html(`<img src="/avatar.png">`),
);

app.get(
  "/avatar.png",
  async (c: Context) => c.body(await kvAdmin.getFile(["files", "avatar.png"]), {
    headers: {
      'Content-Type': 'image/png', // 画像のMIMEタイプを指定
    }
  }),
);

Deno.serve(app.fetch);
