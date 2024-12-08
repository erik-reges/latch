import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
  loader: async ({ context: { api, qc } }) => {
    await qc.prefetchQuery({
      queryKey: ["hello2"],
      queryFn: () => api.hello.get(),
    });
  },
});

function RouteComponent() {
  const { api } = Route.useRouteContext();

  const { data, isLoading } = useQuery({
    queryKey: ["hello2"],
    queryFn: () => api.hello.get(),
  });

  return <div>hello from elysia: {data?.data?.message}</div>;
}
