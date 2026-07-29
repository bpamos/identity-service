import { Router } from "express";
import { issueToken, introspectToken, verifyRefreshPath } from "../tokens";
import { requireAuth, type AuthedRequest } from "../middleware/auth";
import { config } from "../config";

export const identityRouter = Router();

identityRouter.get("/health", (_req, res) => {
  res.json({ ok: true, service: "identity-service" });
});

identityRouter.post("/token", (req, res) => {
  const sub = String(req.body?.sub ?? "");
  const scope = String(req.body?.scope ?? "read");
  if (!sub) {
    res.status(400).json({ error: "sub_required" });
    return;
  }
  const access_token = issueToken({ sub, scope });
  res.status(201).json({ access_token, token_type: "Bearer", expires_in: 3600 });
});

identityRouter.post("/introspect", (req, res) => {
  const token = String(req.body?.token ?? "");
  try {
    const claims = introspectToken(token);
    res.json({ active: true, ...claims });
  } catch {
    res.json({ active: false });
  }
});

identityRouter.post("/refresh/verify", (req, res) => {
  const token = String(req.body?.token ?? "");
  try {
    const claims = verifyRefreshPath(token);
    res.json({ ok: true, sub: claims.sub, scope: claims.scope });
  } catch {
    res.status(401).json({ ok: false });
  }
});

identityRouter.get("/jwks-ish", (_req, res) => {
  res.json({
    keys: [
      {
        kty: "EC",
        use: "sig",
        alg: config.algorithm,
        note: "static metadata stub for demo clients",
      },
    ],
  });
});

identityRouter.get("/session/ping", requireAuth, (req: AuthedRequest, res) => {
  res.json({ ok: true, sub: req.auth?.sub });
});
