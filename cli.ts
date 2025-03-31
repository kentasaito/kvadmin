#!/usr/bin/env -S deno run --allow-read --allow-write --unstable-kv

/**
 * CLI tool for managing Deno KV storage.
 * This script provides commands for dumping, listing, retrieving, setting, deleting, clearing, and restoring data in a Deno KV database.
 * @module
 */

import { KvAdmin } from "./KvAdmin.ts";

/**
 * Displays the help message with usage instructions and available subcommands.
 */
function help() {
  console.error("Usage: kvadmin PATH [subcommand]");
  console.error("subcommands:");
  console.error("    dump        dump the database to a file");
  console.error("    list        list all entries in the database");
  console.error("    get         get an entry from the database");
  console.error("    set         set an entry in the database");
  console.error("    getFile     retrieve binary data of a key and save it to a file");
  console.error("    setFile     store a file's contents in the database under a key");
  console.error("    delete      delete an entry from the database");
  console.error("    clear       clear the database");
  console.error("    restore     restore the database from a file");
  Deno.exit(1);
}

/**
 * Main function for handling CLI commands.
 * Parses arguments and executes the corresponding subcommand.
 */
async function main() {
  if (Deno.args.length < 1) {
    help();
  }

  // Initialize KvAdmin instance with the provided path
  const admin = await KvAdmin.getInstance(Deno.args.shift());

  // Parse and execute the subcommand
  switch (Deno.args.shift()) {
    case "dump": {
      /**
       * Dumps the database to a specified file.
       * Usage: kvadmin PATH dump <filename> [prefix]
       */
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH dump <filename> [prefix]");
        Deno.exit(1);
      }
      await admin.dump(Deno.args.shift() as string, Deno.args);
      break;
    }
    case "list": {
      /**
       * Lists all entries in the database.
       * Usage: kvadmin PATH list [prefix]
       */
      console.log(JSON.stringify(await admin.list(Deno.args), null, 2));
      break;
    }
    case "get": {
      /**
       * Retrieves the value of a specific key.
       * Usage: kvadmin PATH get [key]
       */
      console.log(JSON.stringify(await admin.get(Deno.args), null, 2));
      break;
    }
    case "getFile": {
      /**
       * Retrieves the binary data of a specific key and writes it to a file.
       * This is useful for extracting file contents stored in the KV storage.
       * Usage: kvadmin PATH getFile [key] [path]
       *
       * [key]  - The key to retrieve the binary data for.
       * [path] - The path to save the retrieved file.
       */
      const path = Deno.args.pop();
      Deno.writeFile(path ?? "", await admin.getFile(Deno.args));
      break;
    }
    case "set": {
      /**
       * Sets a value for a specific key.
       * Usage: kvadmin PATH set [key] [value]
       */
      if (Deno.args.length < 2) {
        console.error("Usage: kvadmin PATH set [key] [value]");
        Deno.exit(1);
      }
      const value = JSON.parse(Deno.args.pop() as string);
      Deno.exit(await admin.set(Deno.args, value) ? 0 : 1);
      break;
    }
    case "setFile": {
      /**
       * Stores the contents of a file in the KV storage under a specific key.
       * Reads the file from the specified path and saves it as binary data.
       * Usage: kvadmin PATH setFile [key] [path]
       *
       * [key]  - The key to associate with the file data.
       * [path] - The path to the file to be stored.
       */
      if (Deno.args.length < 2) {
        console.error("Usage: kvadmin PATH setFile [key] [path]");
        Deno.exit(1);
      }
      const path = Deno.args.pop();
      Deno.exit(await admin.setFile(Deno.args, path ?? "") ? 0 : 1);
      break;
    }
    case "delete": {
      /**
       * Deletes a specific key from the database.
       * Usage: kvadmin PATH delete [key]
       */
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH delete [key]");
        Deno.exit(1);
      }
      await admin.delete(Deno.args);
      break;
    }
    case "clear": {
      /**
       * Clears all entries in the database that match the given prefix.
       * Usage: kvadmin PATH clear [prefix]
       */
      await admin.clear(Deno.args);
      break;
    }
    case "restore": {
      /**
       * Restores the database from a specified dump file.
       * Usage: kvadmin PATH restore <filename>
       */
      if (Deno.args.length < 1) {
        console.error("Usage: kvadmin PATH restore <filename>");
        Deno.exit(1);
      }
      await admin.restore(Deno.args.shift() as string);
      break;
    }
    default: {
      /**
       * Displays the help message if an unknown subcommand is provided.
       */
      help();
    }
  }
}

// Execute the main function
main();
