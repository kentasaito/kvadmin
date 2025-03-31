import { KvAdmin } from "jsr:@kenta/kvadmin";

const kvAdmin = await KvAdmin.getInstance("./data.db");
await kvAdmin.set(["myKey"], { "name": "John", "age": 30 });
console.log(await kvAdmin.get(["myKey"]));
await kvAdmin.dump("./dump.json");
await kvAdmin.delete(["myKey"]);
await kvAdmin.clear();
await kvAdmin.restore("./dump.json");
console.log(await kvAdmin.list());
await kvAdmin.setFile(["files", "avatar.png"], "./avatar.png");
