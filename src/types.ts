export interface IdentityClaims {
  sub: string;
  scope: string;
  iat?: number;
  exp?: number;
}
