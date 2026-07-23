import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/Experience";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "XAI — Intelligence Workspace" },
      {
        name: "description",
        content:
          "The next generation AI workspace transforming information into insights, decisions and intelligent automation.",
      },
      { property: "og:title", content: "XAI — Intelligence Workspace" },
      {
        property: "og:description",
        content:
          "A cinematic AI workspace that turns raw data into intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <Experience />;
}
