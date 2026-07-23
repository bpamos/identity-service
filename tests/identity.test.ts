import request from "supertest";
import { createApp } from "../src/app";
import { issueToken, introspectToken, verifyAccessToken, verifyRefreshPath } from "../src/tokens";

describe("identity-service robust cases", () => {
  const app = createApp();

  it("GET /health is open", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.service).toBe("identity-service");
  });

  it("GET /jwks-ish returns key metadata stub", async () => {
    const res = await request(app).get("/jwks-ish");
    expect(res.status).toBe(200);
    expect(res.body.keys[0].kty).toBe("EC");
  });

  it("POST /token requires sub", async () => {
    const res = await request(app).post("/token").send({ scope: "read" });
    expect(res.status).toBe(400);
  });

  it("introspect reports inactive for garbage", async () => {
    const res = await request(app).post("/introspect").send({ token: "nope" });
    expect(res.status).toBe(200);
    expect(res.body.active).toBe(false);
  });

  it("refresh/verify rejects garbage", async () => {
    const res = await request(app).post("/refresh/verify").send({ token: "nope" });
    expect(res.status).toBe(401);
  });

  it("session/ping requires auth", async () => {
    const res = await request(app).get("/session/ping");
    expect(res.status).toBe(401);
  });

  it("rejects empty token at introspectToken", () => {
    expect(() => introspectToken("")).toThrow();
  });

  it("rejects malformed token at verifyAccessToken", () => {
    expect(() => verifyAccessToken("not.a.jwt")).toThrow();
  });

  it("rejects malformed token at verifyRefreshPath", () => {
    expect(() => verifyRefreshPath("a.b")).toThrow();
  });
});

describe("identity planted breakages (require code refactor at 9.0.0)", () => {
  // These three exercise the three verify call sites via issue→verify paths.
  // At 8.5.1 EC+RS256 is tolerated; at 9.0.0 key-type/alg validation rejects it.
  // Fix requires switching to ES256 + explicit algorithms allowlists — not test-only edits.

  it("issue→verify round-trip via verifyAccessToken", () => {
    const token = issueToken({ sub: "alice", scope: "read write" });
    const claims = verifyAccessToken(token);
    expect(claims.sub).toBe("alice");
    expect(claims.scope).toBe("read write");
  });

  it("introspect of a freshly issued token", () => {
    const token = issueToken({ sub: "bob", scope: "read" });
    const claims = introspectToken(token);
    expect(claims.sub).toBe("bob");
  });

  it("refresh-path verify of a freshly issued token", () => {
    const token = issueToken({ sub: "carol", scope: "refresh" });
    const claims = verifyRefreshPath(token);
    expect(claims.sub).toBe("carol");
    expect(claims.scope).toBe("refresh");
  });
});
