import { Db, MongoClient } from "mongodb";
import { AsyncLocalStorage } from "async_hooks";

interface Context {
  client: MongoClient;
  db: Db;
}

async function connectToMongoDB(url: string) {
  const client = await MongoClient.connect(url);
  return client;
}

const asyncLocalStorage = new AsyncLocalStorage<Context>();

export async function withDb<T = unknown>(
  url: string,
  dbName: string,
  handler: () => Promise<T>
) {
  const client = await connectToMongoDB(url);
  try {
    const db = client.db(dbName);
    const localStorage = await asyncLocalStorage.run({ client, db }, handler);
    return localStorage;
  } finally {
    await client.close();
  }
}

export function getDb(): Db {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw Error("Unable to connect to database");
  }
  return store.db;
}

export function getClient(): MongoClient {
  const store = asyncLocalStorage.getStore();
  if (!store) {
    throw Error("Unable to connect to database");
  }
  return store.client;
}
