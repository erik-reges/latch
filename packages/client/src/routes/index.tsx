import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: AboutComponent,
  loader: async ({ context: { api, qc } }) => {
    await qc.prefetchQuery({
      queryKey: ["hello2"],
      queryFn: () => api.hello.get(),
    });
  },
});
function AboutComponent() {
  const { api } = Route.useRouteContext();

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
