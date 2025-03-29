# KvAdmin

KvAdmin is a CLI tool for managing Deno KV storage. This tool allows you to
easily perform operations such as dumping, listing, retrieving, setting,
deleting, clearing, and restoring the database.

## Features

    - Simplifies management of Deno KV storage
    - Supports database dump and restore functionality
    - Key-value operations (get, set, delete)
    - Clear the entire database

## Requirements

    - Deno 1.35.0 or higher

## Installation

    To install KvAdmin globally, run the following command:

<pre>
deno install -grf --allow-read --allow-write --unstable-kv jsr:@kenta/kvadmin/cli -n kvadmin
</pre>

    After installation, you can use the `kvadmin` command globally:

<pre>
kvadmin PATH [subcommand]
</pre>

## Usage

    Run the following command to execute `kvadmin`

<pre>
kvadmin PATH [subcommand]
</pre>

## Subcommands

    dump <filename> [prefix]
      Dumps the database to the specified file.

    list [prefix]
      Lists all entries in the database.

    get <key>
      Retrieves the value of the specified key.

    set <key> <value>
      Sets the value for the specified key.

    delete <key>
      Deletes the specified key.

    clear
      Clears the entire database.

    restore <filename>
      Restores the database from a dump file.

## Examples

    Set a value for a key

<pre>
kvadmin ./data.db set myKey '{"name": "John", "age": 30}'
</pre>

    Retrieve the value of a key

<pre>
kvadmin ./data.db get myKey
</pre>

    Dump the database

<pre>
kvadmin ./data.db dump dump.json
</pre>

    Delete a key

<pre>
kvadmin ./data.db delete myKey
</pre>

    Clear the database

<pre>
kvadmin ./data.db clear
</pre>

    Restore the database from a dump file

<pre>
kvadmin ./data.db restore dump.json
</pre>

    List all entries in the database

<pre>
kvadmin ./data.db list
</pre>

## License

    This project is licensed under the MIT License.
