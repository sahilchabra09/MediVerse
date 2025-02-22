export {}

// Define the roles available in your app
export type Roles =  "PATIENT" | "DOCTOR";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
