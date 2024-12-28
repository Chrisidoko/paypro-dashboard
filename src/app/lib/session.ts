/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Example users (replace with a database in production)
type User = {
  id: string;
  email: string;
  username: string;
  schoolID: number | null;
  role: "admin" | "user"; // Use string literals for role if it's constrained
};

const testUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    username: "KADUNA TERTIARY INSTITUTIONS",
    schoolID: null,
    role: "admin",
  },
  {
    id: "1",
    email: "admin@kadirs.com",
    username: "KADUNA TERTIARY INSTITUTIONS",
    schoolID: null,
    role: "admin",
  },
  {
    id: "3",
    email: "admin@cnmtw.com",
    username: "College of Midwifery Tudun Wada Kaduna",
    schoolID: 7,
    role: "user",
  },
  {
    id: "4",
    email: "emmanuelbalison@gmail.com",
    username: "COLLEGE OF NURSING AND MIDWIFERY KAFANCHAN",
    schoolID: 8,
    role: "user",
  },
  {
    id: "5",
    email: "kusfa2006@gmail.com",
    username: "Shehu Idris College of Health Science & Technology Makarfi",
    schoolID: 11,
    role: "user", // Example differentiation field
  },
  {
    id: "6",
    email: "coegidanwaya@admin",
    username: "Kaduna State College of Education, Gidan Waya",
    schoolID: 9,
    role: "user", // Example differentiation field
  },
];

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

// Retrieve the current user based on the session
export async function getUserBySession(): Promise<{
  id: string;
  email: string;
  role: string;
} | null> {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;

  const session = await decrypt(sessionCookie);
  if (
    !session ||
    typeof session.expiresAt !== "string" ||
    isNaN(Date.parse(session.expiresAt))
  ) {
    await deleteSession(); // Delete expired session
    return null;
  }

  // Find user by ID
  return testUsers.find((user) => user.id === session.userId) || null;
}
