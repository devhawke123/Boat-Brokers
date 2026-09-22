import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: "Not found" });
}

// Last-resort safety net: anything thrown/rejected in a route handler that
// isn't already handled (e.g. a Prisma error, a bug) lands here instead of
// falling through to Express's default HTML/empty error response, which the
// frontend can't parse into a useful message.
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(err);
    return;
  }
  console.error(`[${req.method} ${req.originalUrl}]`, err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
}
