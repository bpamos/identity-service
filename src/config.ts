import fs from "fs";
import path from "path";

const keysDir = path.join(__dirname, "keys");

export const config = {
  port: Number(process.env.PORT ?? 3003),
  serviceName: "identity-service",
  // Demo fixture keys (not production secrets).
  privateKeyPem: fs.readFileSync(path.join(keysDir, "ec-private.pem"), "utf8"),
  publicKeyPem: fs.readFileSync(path.join(keysDir, "ec-public.pem"), "utf8"),
  // EC P-256 signing key — ES256 is required by jsonwebtoken@9.0.0 for ec keys.
  algorithm: "ES256" as const,
};
