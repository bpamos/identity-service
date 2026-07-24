import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../tokens";
import type { IdentityClaims } from "../types";

export interface AuthedRequest extends Request {
  auth?: IdentityClaims;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "missing_bearer_token" });
    return;
  }
  try {
    req.auth = verifyAccessToken(header.slice("Bearer ".length).trim());
    next();
  } catch {
    res.status(401).json({ error: "invalid_token" });
  }
}
