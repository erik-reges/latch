import { getSession, revokeSession, signOut, useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export function Logout() {
  const navigate = useNavigate();

  const { data: session } = useSession();

  return (
    <Button
      variant={"default"}
      onClick={() => {
        signOut({
          fetchOptions: {
            onSuccess: () => {
              revokeSession({ token: session?.session.token ?? "" });

              navigate({
                to: "/signin",
                search: {
                  email: session?.user.email,
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
