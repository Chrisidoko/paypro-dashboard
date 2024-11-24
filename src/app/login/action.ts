"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";



const testUsers = [
  {
    id: "1",
    email: "admin@example.com",
    username: "KADUNA TETIARY INSTITUTION",
    password: "12345678",
    role: "admin", // Example differentiation field
  },
  {
    id: "2",
    email: "user1@example.com",
    username:"COE GIDAN WAYA",
    password: "password123",
    role: "user", // Example differentiation field
  },
  {
    id: "3",
    email: "user2@example.com",
    username:"KADUNA STATE UNIVERSITY",
    password: "password123",
    role: "user", // Example differentiation field
  },
];

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

    // Check credentials against test users
    const user = testUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

  await createSession(user.id); // Store user ID in session
  

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}