/* eslint-disable @typescript-eslint/no-unused-vars */

"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";

const testUsers = [
  {
    id: "1",
    email: "admin@example.com",
    username: "KADUNA TERTIARY INSTITUTIONS",
    password: "12345678",
    schoolID: "",
    role: "admin", // Example differentiation field
  },
  {
    id: "1",
    email: "admin@kadirs.com",
    username: "KADUNA TERTIARY INSTITUTIONS",
    password: "admin@kadirs.com",
    schoolID: "",
    role: "admin", // Example differentiation field
  },
  {
    id: "3",
    email: "admin@cnmtw.com",
    username: "College of Midwifery Tudun Wada Kaduna",
    password: "password123",
    schoolID: 7,
    role: "user", // Example differentiation field
  },
  {
    id: "4",
    email: "emmanuelbalison@gmail.com",
    username: "COLLEGE OF NURSING AND MIDWIFERY KAFANCHAN",
    password: "password123",
    schoolID: 8,
    role: "user", // Example differentiation field
  },
  {
    id: "5",
    email: "kusfa2006@gmail.com",
    username: "Shehu Idris College of Health Science & Technology Makarfi",
    password: "kusfa2006",
    schoolID: 11,
    role: "user", // Example differentiation field
  },
  {
    id: "6",
    email: "coegidanwaya@gmail.com",
    username: "Kaduna State College of Education, Gidan Waya",
    password: "coegidanwaya",
    schoolID: 9,
    role: "user", // Example differentiation field
  },
  {
    id: "7",
    email: "kasu@gmail.com",
    username: "Kaduna State College of Education, Gidan Waya",
    password: "kasu@gmail.com",
    schoolID: 1003,
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

export async function login(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  formData: FormData
) {
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
