import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withDb } from "../libs/dbClient";

export default function withDefaultDb(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    return withDb(
      process.env.MONGODB_URL!,
      process.env.MONGODB_DBNAME!,
      async () => await handler(req, res)
    );
  };
}
