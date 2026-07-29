import fs from "fs";
import path from "path";

const keysDir = path.join(__dirname, "keys");

export const config = {
  port: Number(process.env.PORT ?? 3003),
  serviceName: "identity-service",
  // Demo fixture keys (not production secrets).
  privateKeyPem: fs.readFileSync(path.join(keysDir, "ec-private.pem"), "utf8"),
  publicKeyPem: fs.readFileSync(path.join(keysDir, "ec-public.pem"), "utf8"),
  // EC key material must use an ES* algorithm (jsonwebtoken@9.0.0 enforces JWS key/alg pairing).
  algorithm: "ES256" as const,
};
