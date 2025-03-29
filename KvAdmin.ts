export default class KvAdmin {
  private static instance: KvAdmin;
  private Kv: Deno.Kv | undefined;

  private constructor() {
  }

  public static async getInstance(path?: string): Promise<KvAdmin> {
    if (!KvAdmin.instance) {
      KvAdmin.instance = new KvAdmin();
      KvAdmin.instance.Kv = await Deno.openKv(path);
    }
    return KvAdmin.instance;
  }

  private ensureInitialized(): void {
    if (this.Kv === undefined) {
      throw new Error("KvAdmin is not initialized. Call getInstance() first.");
    }
  }

  public async dump(filename: string, prefix: string[]): Promise<void> {
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

  public async get(key: string[]): Promise<object> {
    this.ensureInitialized();
    const entry = await this.Kv!.get(key);
    return entry.value as object;
  }

  public async set(key: string[], value: object): Promise<boolean> {
    console.log({ key, value });
    this.ensureInitialized();
    return (await this.Kv!.set(key, value)).ok;
  }

  public async delete(key: string[]): Promise<void> {
    this.ensureInitialized();
    await this.Kv!.delete(key);
  }

  public async clear(prefix: string[] = []): Promise<void> {
    this.ensureInitialized();
    const iterator = this.Kv!.list({ prefix });
    for await (const entry of iterator) {
      this.Kv!.delete(entry.key);
    }
  }

  public async restore(filename: string): Promise<void> {
    this.ensureInitialized();
    const entries = JSON.parse(await Deno.readTextFile(filename));
    for (const entry of entries) {
      this.Kv!.set(entry.key, entry.value);
    }
  }
}
