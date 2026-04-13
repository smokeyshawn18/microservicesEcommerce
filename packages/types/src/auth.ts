export interface CustomJWTClaims {
  metadata?: {
    role?: "user" | "admin";
  };
}
