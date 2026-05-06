import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: () => import("./routes/HomePage") },
      { path: "demo", lazy: () => import("./routes/DemoPage") },
      // The interactive research playground (kept for the post-load destination)
      { path: "research", lazy: () => import("./features/research") },
      // Lessons
      { path: "lessons/introduction", lazy: () => import("./lessons/0-introduction") },
      { path: "lessons/loading-the-model", lazy: () => import("./lessons/1-loading-the-model") },
      { path: "lessons/planning", lazy: () => import("./lessons/2-planning") },
      { path: "lessons/retrieval", lazy: () => import("./lessons/3-retrieval") },
      { path: "lessons/synthesis", lazy: () => import("./lessons/4-synthesis") },
      { path: "lessons/the-loop", lazy: () => import("./lessons/5-the-loop") },
    ],
  },
]);
