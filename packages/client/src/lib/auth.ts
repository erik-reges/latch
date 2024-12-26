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
  getSession,
  signOut,
  changeEmail,
  changePassword,
  resetPassword,
  updateUser,
  revokeSession,
} = createAuthClient({
  baseURL: `${import.meta.env.VITE_API_URL}/api/auth`,
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const isValidSession = (session: Session | null): boolean => {
  if (!session) return false;
  if (!session.token) return false;
  return new Date(session.expiresAt) > new Date();
};

const debugSession = async () => {
  try {
    const result = await getSession();
    console.log("Session check result:", result);
    return result;
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
};

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Session management
  setAuth: (user: User, session: Session) => void;
  clearAuth: () => void;

  // Auth actions
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;

  logout: () => Promise<void>;
  verifyAndUpdateSession: () => Promise<void>;
  // User management
  updateUserEmail: (newEmail: string, password: string) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  requestPasswordReset: (newPassword: string, token?: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        setAuth: (user: User, session: Session) => {
          set({
            user,
            session,
            isAuthenticated: true,
            error: null,
          });
        },

        clearAuth: () => {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            error: null,
          });
        },

        login: async (email: string, password: string, rememberMe = true) => {
          set({ isLoading: true, error: null });
          try {
            const result = await signIn.email({
              email,
              password,
              rememberMe,
            });

            console.log("Sign in result:", result);

            if (result.error) {
              throw new Error(result.error.message || "Failed to sign in");
            }

            if (result.data) {
              // Verify session immediately after login
              const sessionCheck = await debugSession();
              console.log("Post-login session check:", sessionCheck);

              // Update state with user data
              const userData = {
                id: result.data.user.id,
                email: result.data.user.email,
                name: result.data.user.name,
                emailVerified: result.data.user.emailVerified,
                image: result.data.user.image,
                createdAt: result.data.user.createdAt,
                updatedAt: result.data.user.updatedAt,
              };

              set({
                user: userData,
                session: sessionCheck?.data?.session ?? null,
                isAuthenticated: true,
              });
            }
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        logout: async () => {
          set({ isLoading: true, error: null });
          try {
            // Only attempt to sign out if we have a session
            if (get().session?.token) {
              await signOut();
            }
            get().clearAuth();
          } catch (error) {
            // If the error is about no session, just clear the auth state
            if ((error as Error).message.includes("Failed to get session")) {
              get().clearAuth();
            } else {
              set({ error: (error as Error).message });
              throw error;
            }
          } finally {
            set({ isLoading: false });
          }
        },

        register: async (email: string, password: string, name: string) => {
          set({ isLoading: true, error: null });
          try {
            const result = await signUp.email({
              email,
              password,
              name,
            });

            if (result.error) {
              throw new Error(result.error.message || "Failed to sign up");
            }
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateUserEmail: async (newEmail: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            await changeEmail({
              newEmail,
              callbackURL: window.location.origin,
            });
            set((state) => ({
              user: state.user ? { ...state.user, email: newEmail } : null,
            }));
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateUserPassword: async (
          currentPassword: string,
          newPassword: string,
        ) => {
          set({ isLoading: true, error: null });
          try {
            await changePassword({
              currentPassword,
              newPassword,
              revokeOtherSessions: true,
            });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        updateUserProfile: async (data: Partial<User>) => {
          set({ isLoading: true, error: null });
          try {
            const response = await updateUser(data);
            set((state) => ({
              user: state.user ? { ...state.user, ...response.data } : null,
            }));
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },

        requestPasswordReset: async (newPassword: string, token?: string) => {
          set({ isLoading: true, error: null });
          try {
            await resetPassword({ newPassword, token });
          } catch (error) {
            set({ error: (error as Error).message });
            throw error;
          } finally {
            set({ isLoading: false });
          }
        },
        verifySession: () => {
          const currentSession = get().session;
          if (!isValidSession(currentSession)) {
            get().clearAuth();
            return false;
          }
          return true;
        },
        verifyAndUpdateSession: async () => {
          const session = get().session;
          if (!session) {
            get().clearAuth();
          } else if (session.id !== get().session?.id) {
            set({ session });
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
        onRehydrateStorage: () => (state) => {
          if (state?.session && !isValidSession(state.session)) {
            state.clearAuth();
          }
        },
      },
    ),
  ),
);

// Selector hooks
export const useUser = () => useAuth((state) => state.user);
export const useSession = () => useAuth((state) => state.session);
export const useIsAuthenticated = () =>
  useAuth((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuth((state) => state.isLoading);
export const useAuthError = () => useAuth((state) => state.error);

// Auth actions hook
export const useAuthActions = () => {
  const store = useAuth();
  return {
    logout: store.logout,
    login: store.login,
    register: store.register,
    clearAuth: store.clearAuth,
    updateEmail: store.updateUserEmail,
    updatePassword: store.updateUserPassword,
    updateProfile: store.updateUserProfile,
    requestPasswordReset: store.requestPasswordReset,
  };
};
