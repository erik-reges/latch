import { getSession, revokeSession, signOut, useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/stores/auth-store";

interface LogoutProps {
  email: string;
  token: string;
}

export function Logout({ email, token }: LogoutProps) {
  const navigate = useNavigate();
  const { logout, clearAuth } = useAuth();

  return (
    <Button
      variant={"default"}
      onClick={() => {
        signOut({
          fetchOptions: {
            onSuccess: () => {
              clearAuth();

              navigate({
                to: "/signin",
                search: {
                  email: email,
                },
              });
            },
          },
        });
      }}
    >
      Logout
    </Button>
  );
}
