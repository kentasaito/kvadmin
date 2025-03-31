import { contentType } from "media_types";
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
  async (c: Context) => {
    const key = c.req.path.split("/").slice(1);
    return c.body(await kvAdmin.getFile(key), {
      headers: {
        "Content-Type": contentType(key.slice(-1)[0].split(".").pop() ?? "") ??
          "", // 画像のMIMEタイプを指定
      },
    });
  },
);

Deno.serve(app.fetch);
