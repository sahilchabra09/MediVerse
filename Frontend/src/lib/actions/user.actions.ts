"use server";

import { db } from "../db";
import * as crypto from 'crypto';

interface User { 
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export async function createUser(user: User) {
  try {
    console.log("Creating user in database:", user);
    const result = await db.user.create({
      data: {
        id: crypto.randomUUID(),
        clerkid: user.clerkId,  // map camelCase to lowercase
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role: user.role || 'member'
      },
    });
    console.log("User created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}