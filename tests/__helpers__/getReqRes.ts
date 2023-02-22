import { NextApiRequest, NextApiResponse } from "next";

interface BaselineRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  query?: { [key: string]: string | string[] };
  body?: { [key: string]: any } | string;
  headers?: { [key: string]: string };
}

export default function getReqRes(req: BaselineRequest = { method: "GET" }) {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    write: jest.fn().mockReturnThis(),
    once: jest.fn().mockReturnThis(),
    on: jest.fn().mockReturnThis(),
    emit: jest.fn().mockReturnThis(),
  } as unknown as NextApiResponse & {
    status: jest.Mock;
    json: jest.Mock;
    end: jest.Mock;
    setHeader: jest.Mock;
    redirect: jest.Mock;
    write: jest.Mock;
    once: jest.Mock;
    on: jest.Mock;
    emit: jest.Mock;
  };

  req.query = req.query || {};
  req.headers = req.headers || {};

  return [req as NextApiRequest, res] as const;
}
