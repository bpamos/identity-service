import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "./config";
import type { IdentityClaims } from "./types";

/** Explicit allowlist — required by jsonwebtoken@9 (CVE-2022-23540/23541). */
const VERIFY_OPTIONS: jwt.VerifyOptions = { algorithms: [config.algorithm] };

export function issueToken(
  claims: Omit<IdentityClaims, "iat" | "exp">,
  expiresIn: SignOptions["expiresIn"] = "1h",
): string {
  return jwt.sign(claims, config.privateKeyPem, {
    algorithm: config.algorithm,
    expiresIn,
  });
}

/** Call site 1 — middleware / inbound API auth */
export function verifyAccessToken(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, VERIFY_OPTIONS) as IdentityClaims;
}

/** Call site 2 — introspect handler */
export function introspectToken(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, VERIFY_OPTIONS) as IdentityClaims;
}

/** Call site 3 — refresh-path helper */
export function verifyRefreshPath(token: string): IdentityClaims {
  return jwt.verify(token, config.publicKeyPem, VERIFY_OPTIONS) as IdentityClaims;
}
