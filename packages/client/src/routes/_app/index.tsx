import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>API URL: {import.meta.env.VITE_API_URL}</p>
    </div>
  );
}
