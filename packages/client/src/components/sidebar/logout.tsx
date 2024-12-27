import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

interface LogoutProps {
  email: string;
  token: string;
}

export function Logout({ email, token }: LogoutProps) {
  const navigate = useNavigate();

  return (
    <Button
      variant={"default"}
      onClick={() => {
        signOut({
          fetchOptions: {
            onSuccess: () => {
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
