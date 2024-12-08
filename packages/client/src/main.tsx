import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { api } from "./lib/api";
import { Link } from "@tanstack/react-router";
import { ThemeProvider } from "./components/dark-mode/theme-provider";

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
      <div className="h-[100vh] w-[100vw] flex flex-col items-center justify-center">
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
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}
