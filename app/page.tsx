import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { Mail } from "lucide-react";

// Utilitaire pour colorer le JSON
function renderStyledJson(obj: unknown, indent = 2): React.ReactNode {
  if (typeof obj === "string") {
    return <span className="text-green-400">&quot;{obj}&quot;</span>;
  }
  if (typeof obj === "number") {
    return <span className="text-orange-400">{obj}</span>;
  }
  if (typeof obj === "boolean") {
    return <span className="text-purple-400">{obj ? "true" : "false"}</span>;
  }
  if (obj === null) {
    return <span className="text-gray-400">null</span>;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return <span>[]</span>;
    return (
      <>
        [
        <br />
        {obj.map((item, i) => (
          <span key={i} className="pl-4 block">
            {" ".repeat(indent)}
            {renderStyledJson(item, indent + 2)}
            {i < obj.length - 1 ? "," : ""}
          </span>
        ))}
        {" ".repeat(indent - 2)}]
      </>
    );
  }
  if (typeof obj === "object") {
    const keys = Object.keys(obj as Record<string, unknown>);
    if (keys.length === 0) return <span>{"{}"}</span>;
    return (
      <>
        {"{"}
        <br />
        {keys.map((key, i) => (
          <span key={key} className="pl-4 block">
            <span className="text-blue-400">&quot;{key}&quot;</span>
            <span className="text-zinc-400">: </span>
            {renderStyledJson(
              (obj as Record<string, unknown>)[key],
              indent + 2
            )}
            {i < keys.length - 1 ? "," : ""}
          </span>
        ))}
        {" ".repeat(indent - 2)}
        {"}"}
      </>
    );
  }
  return null;
}

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    // Redirige les utilisateurs connectés vers le dashboard
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Video Section */}
      <section className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 text-center">
          Instantly Audit Any Webpage with Element Hunter
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl mb-10">
          The ultimate Chrome extension for SEO, web tech, and content analysis.
          See everything in one click—right inside your dashboard.
        </p>
        <div className="relative w-full max-w-3xl mx-auto flex justify-center">
          <Image
            src="/Apple iPad Pro 13_ Silver - Landscape.png"
            alt="iPad Pro Mockup"
            width={982}
            height={768}
            className="w-full h-auto select-none pointer-events-none"
            priority
          />
          <div
            className="absolute top-[4.5%] left-[3.2%] w-[93.6%] h-[91.5%] flex items-center justify-center rounded-[32px] overflow-hidden bg-black"
            style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.05)" }}
          >
            <video
              src="/element-hunter-demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[97%] h-[97%] object-cover rounded-[28px] mx-auto my-auto"
              style={{ display: "block" }}
            />
          </div>
        </div>
        {/* CTA Add to Chrome sous le mockup iPad */}
        <div className="flex justify-center mt-8">
          <a
            href="https://chromewebstore.google.com/detail/mbghaanijakiickkmpobkplcpodncmae?utm_source=web-vercel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="glossyAccent"
              className="flex items-center gap-3 px-8 py-4 text-xl rounded-full shadow-lg min-h-[64px] min-w-[240px]"
            >
              <Image
                src="/chrome-logo.svg"
                alt="Chrome Logo"
                width={28}
                height={28}
              />
              Add to Chrome
            </Button>
          </a>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-xl font-semibold text-center mb-4">
          🎯 Perfect for
        </h2>
        <ul className="flex flex-wrap justify-center gap-4 text-base text-muted-foreground font-medium">
          <li className="bg-white/80 rounded-lg px-4 py-2 shadow transition-colors duration-200 hover:bg-pink-100 cursor-pointer">
            SEO agencies
          </li>
          <li className="bg-white/80 rounded-lg px-4 py-2 shadow transition-colors duration-200 hover:bg-blue-100 cursor-pointer">
            Freelancers & marketing consultants
          </li>
          <li className="bg-white/80 rounded-lg px-4 py-2 shadow transition-colors duration-200 hover:bg-green-100 cursor-pointer">
            Web developers
          </li>
          <li className="bg-white/80 rounded-lg px-4 py-2 shadow transition-colors duration-200 hover:bg-yellow-100 cursor-pointer">
            Content creators
          </li>
        </ul>
      </section>

      {/* Alternating Feature Sections */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center py-16 px-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">✅ Instant SEO Audit</h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>Essential tags (title, meta, h1, h2…)</li>
            <li>Robots.txt, viewport settings, and technical best practices</li>
          </ul>
          <h2 className="text-2xl font-bold mb-2 mt-8">
            🔧 Web Technology Detection
          </h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>Frameworks (React, Vue, jQuery…)</li>
            <li>UI Libraries (Tailwind, Bootstrap…)</li>
            <li>CMS platforms (WordPress, Joomla…)</li>
            <li>Hosting and services (Cloudflare…)</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Image
            src="/hp-tech.png"
            alt="SEO Audit & Tech Detection"
            width={1000}
            height={1000}
            className="rounded-lg border shadow"
          />
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center py-16 px-4">
        <div className="order-2 md:order-1 flex justify-center">
          <Image
            src="/hp-image.png"
            alt="Keyword Extraction & Content"
            width={1000}
            height={1000}
            className="rounded-lg border shadow"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-bold mb-2">🧠 Keyword Extraction</h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>Detect keywords used on the page</li>
            <li>View frequency and relevance scores</li>
          </ul>
          <h2 className="text-2xl font-bold mb-2 mt-8">🖼️ Image Analysis</h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>Preview all images</li>
            <li>Check for ALT tags (accessibility)</li>
          </ul>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center py-16 px-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">📤 Easy Export</h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>Export everything to CSV or JSON in one click</li>
          </ul>
          <h2 className="text-2xl font-bold mb-2 mt-8">
            🌐 Automatic Dashboard Sync
          </h2>
          <ul className="list-disc ml-6 text-muted-foreground mb-4">
            <li>
              Every scan you perform is automatically saved to your personal
              dashboard
            </li>
            <li>Organize by client, folder, or campaign</li>
            <li>Compare multiple scans and track performance over time</li>
            <li>Access your dashboard anywhere</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-xl bg-zinc-900 rounded-xl shadow-lg p-4 overflow-x-auto border border-zinc-800 max-h-64 overflow-y-auto">
            <code className="text-xs md:text-sm leading-snug text-left font-mono select-text">
              {renderStyledJson({
                meta: {
                  title: "LA – Figma",
                  meta: {
                    viewport: "width=device-width, initial-scale=1.0",
                    "og:title": "Figma",
                  },
                },
                links: {
                  internal: [
                    {
                      url: "https://www.figma.com/files",
                      text: "Drafts",
                    },
                  ],
                },
              })}
            </code>
          </div>
        </div>
      </section>

      {/* --- CTA Add to Chrome juste avant le footer --- */}
      <div className="flex justify-center mt-16 mb-8">
        <a
          href="https://chromewebstore.google.com/detail/mbghaanijakiickkmpobkplcpodncmae?utm_source=web-vercel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="glossyAccent"
            className="flex items-center gap-3 px-8 py-4 text-xl rounded-full shadow-lg min-h-[64px] min-w-[240px]"
          >
            <Image
              src="/chrome-logo.svg"
              alt="Chrome Logo"
              width={28}
              height={28}
            />
            Add to Chrome
          </Button>
        </a>
      </div>

      {/* Why Choose Section (footer harmonisé) */}
      <footer className="w-full py-16 px-4 mt-16 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-6 text-primary">
            💡 Why Choose Element Hunter?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The ultimate Chrome extension for web developers and SEO experts.
            Extract, analyze, and optimize your web content with ease.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" passHref legacyBehavior>
              <Button
                variant="glossyAccent"
                size="lg"
                className="w-full sm:w-auto"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/register" passHref legacyBehavior>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4" />
            <a
              href="mailto:prouffbenjamin@gmail.com"
              className="hover:text-primary transition-colors"
            >
              prouffbenjamin@gmail.com
            </a>
          </div>
          <div className="mt-6 text-xs text-zinc-400">
            © {new Date().getFullYear()} Element Hunter. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
