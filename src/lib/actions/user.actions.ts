"use server";

import { db } from "../db";

interface User { 
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export async function createUser(user: User) {
  return await db.user.create({
    data: user,
  });
}