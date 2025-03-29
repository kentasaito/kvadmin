import { KvAdmin } from "jsr:@kenta/kvadmin";

const kvadmin = await KvAdmin.getInstance("./data.db");
await kvadmin.set(["myKey"], { "name": "John", "age": 30 });
console.log(await kvadmin.get(["myKey"]));
await kvadmin.dump("dump.json");
await kvadmin.delete(["myKey"]);
await kvadmin.clear();
await kvadmin.restore("dump.json");
console.log(await kvadmin.list());
