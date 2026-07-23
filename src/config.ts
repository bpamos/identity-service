import fs from "fs";
import path from "path";

const keysDir = path.join(__dirname, "keys");

export const config = {
  port: Number(process.env.PORT ?? 3003),
  serviceName: "identity-service",
  // Demo fixture keys (not production secrets).
  privateKeyPem: fs.readFileSync(path.join(keysDir, "ec-private.pem"), "utf8"),
  publicKeyPem: fs.readFileSync(path.join(keysDir, "ec-public.pem"), "utf8"),
  // Planted 8.x-era mismatch: EC key material labeled/used as RS256.
  // jsonwebtoken@8.5.1 tolerates this; @9.0.0 requires ES256 for ec keys.
  algorithm: "RS256" as const,
};
