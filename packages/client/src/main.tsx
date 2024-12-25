import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/dark-mode/theme-provider";
import { treatyClient } from "../../api/lib/eden";

export const api = treatyClient(import.meta.env.VITE_API_URL);
export type API = typeof api;
export const qc = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "viewport",
  context: {
    qc: qc,
    api: api,
  },
  defaultNotFoundComponent: () => {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center">
        <p>404 Not found</p>
      </div>
    );
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={qc}>
      <ThemeProvider defaultTheme="blue" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
