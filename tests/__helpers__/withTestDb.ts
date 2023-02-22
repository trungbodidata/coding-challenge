import generateId from "@common/utils/generateId";
import { withDb, getClient } from "@common/libs/dbClient";

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  process.env = OLD_ENV;
});

export default async function withTestDb(handler: () => Promise<unknown>) {
  const randomName = `test-${generateId("abcdefghijklmnopqrstuvwxyz", 5)}`;
  process.env.MONGODB_DBNAME = randomName;

  return withDb(process.env.MONGODB_URL!, randomName, async () => {
    const client = getClient();
    try {
      await handler();
    } finally {
      await client.db(randomName).dropDatabase();
      await client.close();
    }
  });
}
