import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: () => import("./routes/HomePage") },
      { path: "research", lazy: () => import("./features/research") },
    ],
  },
]);
