export {}

// Define the roles available in your app
export type Roles =  "member" | "doctor";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
