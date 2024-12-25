import { createAuthClient } from "better-auth/react";
export const {
  signIn,
  signUp,
  useSession,
  getSession,
  signOut,
  changeEmail,
  changePassword,
  resetPassword,
  updateUser,
  revokeSession,
} = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
});

export async function isAuthenticated() {
  const { data } = await getSession();

  return data !== null && Boolean(data?.user);
}

export function getToken(): string | null {
  const { data: session } = useSession();

  return session?.session?.token ?? null;
}

export function getUser() {
  const { data: session } = useSession();
  return session?.user ?? null;
}

export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
};

export type Session = {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  token: string;
  ipAddress?: string | null | undefined;
  userAgent?: string | null | undefined;
};
