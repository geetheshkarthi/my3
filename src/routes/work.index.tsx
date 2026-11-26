import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/work/")({
  head: () => ({ meta: [
    { title: "Our Work | Selected Projects | My3 Digital" },
    { name: "description", content: "Selected website, e-commerce, branding, digital marketing and interactive projects by My3 Digital." },
    { property: "og:title", content: "Our Work | My3 Digital" },
    { property: "og:description", content: "Ideas brought to life. Businesses moved forward." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Work,
});

/** Interactive 3D video showcase (public/work-showcase), shown full-screen under the site header. */
function Work() {
  const navigate = useNavigate();
  // The showcase posts a message when a website is clicked; open its case-study page
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { type?: string; slug?: string } | null;
      if (d?.type === "my3-open-work" && d.slug) navigate({ to: "/work/$slug", params: { slug: d.slug } });
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, [navigate]);
  return (
    <main>
      <iframe
        src="/work-showcase/index.html"
        title="My3 Digital — selected websites"
        allow="autoplay; fullscreen"
        className="block h-[100svh] w-full border-0 bg-background"
      />
    </main>
  );
}
