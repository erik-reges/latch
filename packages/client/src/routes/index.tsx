import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession, useSession } from "@/lib/auth";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: AboutComponent,
  // beforeLoad: async ({}) => {
  //   const session = useSession();
  //   if (!session.data?.user) {
  //     const navigate = useNavigate();

  //     navigate({
  //       to: "/about",
  //     });
  //   }
  // },
  // loader: async ({ context: { api, qc } }) => {
  //   await qc.prefetchQuery({
  //     queryKey: ["hello2"],
  //     queryFn: () => api.hello.get(),
  //   });
  // },
});

function AboutComponent() {
  const { api } = Route.useRouteContext();
  const session = useSession();

  console.log(session.data?.user);
  if (!session.data?.user) {
    const navigate = useNavigate();

    navigate({
      to: "/about",
    });
  }

  const { data, isLoading } = useQuery({
    queryKey: ["hello2"],
    queryFn: () => api.hello.get(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center pt-36">
      {data?.data?.message} from api
    </div>
  );
}
