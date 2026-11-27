import { createFileRoute } from "@tanstack/react-router";
import { ServiceSheets } from "@/components/services/ServiceSheets";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title:
          "Digital Services | Web Development, Branding & Marketing | My3 Digital",
      },
      {
        name: "description",
        content:
          "Website development, branding, performance marketing, digital marketing and technology & automation services from My3 Digital.",
      },
      {
        property: "og:title",
        content:
          "Digital Services | Web Development, Branding & Marketing | My3 Digital",
      },
      {
        property: "og:description",
        content: "One partner. Every possibility in digital.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <main
      data-blur-managed="true"
      className="services-motion-page relative min-h-screen overflow-x-clip bg-black font-sans text-slate-100 selection:bg-[#D2FF1F] selection:text-black"
    >
      <ServiceSheets />
    </main>
  );
}
