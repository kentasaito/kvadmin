#!/usr/bin/env -S deno run --allow-read --allow-write --unstable-kv

import KvAdmin from "./KvAdmin.ts";

function help() {
  console.error("Usage: kvadmin PATH [subcommand]");
  console.error("subcommands:");
  console.error("    dump        dump the database to a file");
  console.error("    list        list all entries in the database");
  console.error("    get         get an entry from the database");
  console.error("    set         set an entry in the database");
  console.error("    delete      delete an entry from the database");
  console.error("    clear       clear the database");
  console.error("    restore     restore the database from a file");
  Deno.exit(1);
}

async function main() {
  if (Deno.args.length < 1) {
    help();
  }
  const admin = await KvAdmin.getInstance(Deno.args.shift());
  switch (Deno.args.shift()) {
    case "dump": {
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH dump <filename> [prefix]");
        Deno.exit(1);
      }
      await admin.dump(Deno.args.shift() as string, Deno.args);
      break;
    }
    case "list": {
      console.log(JSON.stringify(await admin.list(Deno.args), null, 2));
      break;
    }
    case "get": {
      console.log(JSON.stringify(await admin.get(Deno.args), null, 2));
      break;
    }
    case "set": {
      if (Deno.args.length < 2) {
        console.error("Usage: kvadmin PATH set [key] [value]");
        Deno.exit(1);
      }
      const value = JSON.parse(Deno.args.pop() as string);
      Deno.exit(await admin.set(Deno.args, value) ? 0 : 1);
      break;
    }
    case "delete": {
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH delete [key]");
        Deno.exit(1);
      }
      await admin.delete(Deno.args);
      break;
    }
    case "clear": {
      await admin.clear(Deno.args);
      break;
    }
    case "restore": {
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH restore <filename>");
        Deno.exit(1);
      }
      await admin.restore(Deno.args.shift() as string);
      break;
    }
    default: {
      help();
    }
  }
}

main();
