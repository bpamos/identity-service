import jwt from "jsonwebtoken";
import { config } from "./config";
import type { IdentityClaims } from "./types";

const verifyOptions = { algorithms: [config.algorithm] };

export function issueToken(claims: Omit<IdentityClaims, "iat" | "exp">, expiresIn: string | number = "1h"): string {
  return jwt.sign(claims, config.privateKeyPem, {
    algorithm: config.algorithm,
    expiresIn,
  });
}

/** Call site 1 — middleware / inbound API auth */
export function verifyAccessToken(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, verifyOptions) as IdentityClaims;
}

/** Call site 2 — introspect handler */
export function introspectToken(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, verifyOptions) as IdentityClaims;
}

/** Call site 3 — refresh-path helper */
export function verifyRefreshPath(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, verifyOptions) as IdentityClaims;
}
