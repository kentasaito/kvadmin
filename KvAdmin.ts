/**
 * KvAdmin is a utility class for managing Deno KV storage.
 * It provides methods for common operations such as dumping, listing, retrieving, setting, deleting, and restoring data.
 * @module
 */
export class KvAdmin {
  private static instance: KvAdmin;
  private Kv: Deno.Kv | undefined;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Returns the singleton instance of KvAdmin.
   * Initializes the Deno KV storage if it hasn't been initialized yet.
   *
   * @param path - The path to the KV storage file (optional).
   * @returns A promise that resolves to the KvAdmin instance.
   */
  public static async getInstance(path?: string): Promise<KvAdmin> {
    if (!KvAdmin.instance) {
      KvAdmin.instance = new KvAdmin();
      KvAdmin.instance.Kv = await Deno.openKv(path);
    }
    return KvAdmin.instance;
  }

  /**
   * Ensures that the KV storage is initialized.
   * Throws an error if the KV storage is not initialized.
   */
  private ensureInitialized(): void {
    if (this.Kv === undefined) {
      throw new Error("KvAdmin is not initialized. Call getInstance() first.");
    }
  }

  /**
   * Dumps the contents of the KV storage to a JSON file.
   *
   * @param filename - The name of the file to write the dump to.
   * @param prefix - An optional prefix to filter the keys to dump.
   */
  public async dump(filename: string, prefix: string[] = []): Promise<void> {
    this.ensureInitialized();
    const entries = [];
    const iterator = this.Kv!.list({ prefix });
    for await (const entry of iterator) {
      entries.push({
        key: entry.key as string[],
        value: entry.value,
      });
    }
    return await Deno.writeTextFile(filename, JSON.stringify(entries));
  }

  /**
   * Lists all entries in the KV storage that match the given prefix.
   *
   * @param prefix - An optional prefix to filter the keys.
   * @returns A promise that resolves to an array of key-value pairs.
   */
  public async list(
    prefix: string[] = [],
  ): Promise<{ key: string[]; value: object }[]> {
    this.ensureInitialized();
    const entries = [];
    const iterator = this.Kv!.list({ prefix });
    for await (const entry of iterator) {
      entries.push({
        key: entry.key as string[],
        value: entry.value as object,
      });
    }
    return entries;
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param key - The key to retrieve the value for.
   * @returns A promise that resolves to the value of the key.
   */
  public async get(key: string[]): Promise<object> {
    this.ensureInitialized();
    const entry = await this.Kv!.get(key);
    return entry.value as object;
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param key - The key to retrieve the value for.
   * @returns A promise that resolves to the value of the key.
   */
  public async getFile(key: string[]): Promise<object> {
    this.ensureInitialized();
    const entry = await this.Kv!.get(key);
    return entry.value;
  }

  /**
   * Sets a value for the given key in the KV storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   * @returns A promise that resolves to a boolean indicating success.
   */
  public async set(key: string[], value: object): Promise<boolean> {
    this.ensureInitialized();
    return (await this.Kv!.set(key, value)).ok;
  }

  /**
   * Sets a value for the given key in the KV storage.
   *
   * @param key - The key to set the value for.
   * @param value - The value to set.
   * @returns A promise that resolves to a boolean indicating success.
   */
  public async setFile(key: string[], path: string): Promise<boolean> {
    this.ensureInitialized();
    return (await this.Kv!.set(key, await Deno.readFile(path))).ok;
  }

  /**
   * Deletes the entry associated with the given key.
   *
   * @param key - The key to delete.
   */
  public async delete(key: string[]): Promise<void> {
    this.ensureInitialized();
    await this.Kv!.delete(key);
  }

  /**
   * Clears all entries in the KV storage that match the given prefix.
   *
   * @param prefix - An optional prefix to filter the keys to delete.
   */
  public async clear(prefix: string[] = []): Promise<void> {
    this.ensureInitialized();
    const iterator = this.Kv!.list({ prefix });
    for await (const entry of iterator) {
      this.Kv!.delete(entry.key);
    }
  }

  /**
   * Restores the KV storage from a JSON file.
   *
   * @param filename - The name of the file to restore from.
   */
  public async restore(filename: string): Promise<void> {
    this.ensureInitialized();
    const entries = JSON.parse(await Deno.readTextFile(filename));
    for (const entry of entries) {
      this.Kv!.set(entry.key, entry.value);
    }
  }
}
