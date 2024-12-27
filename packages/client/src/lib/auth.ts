import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
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
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  fetchOptions: {
    onError: (error) => console.log("error", error),
    priority: "high",
    credentials: "include",
    mode: "cors",
    headers: {
      "X-Forwarded-Proto": "https",
    },
    cache: "no-cache",
    referrerPolicy: "strict-origin-when-cross-origin",
    onSuccess: (success) => console.log("success", success),
    onRequest: (request) => {
      console.log("request", request);
      return request;
    },
    onResponse: (response) => {
      console.log("response", response);
      return response;
    },
  },
});
