import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/")({
  component: RouteComponent,
  beforeLoad: ({}) => {
    throw redirect({
      to: "/vehicles",
      search: {
        page: 1,
        pageSize: 10,
        sortField: "createdAt",
        sortOrder: "asc",
      },
    });
  },
});

function RouteComponent() {
  return <div></div>;
}
