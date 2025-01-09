import "@clerk/nextjs";

declare module "@clerk/nextjs" {
  export interface UserPublicMetadata {
    role?: "member" | "doctor";
  }
}
