import { useEffect, useState } from "react";

const links = ["Home", "Platform", "Solutions", "Pricing", "About", "Contact"];

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 100 && y > lastY);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${hidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-6">
        <a href="#" data-magnetic className="flex items-center gap-2 text-white">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-md opacity-60" />
            <div className="absolute inset-0 rounded-full border border-white/40" />
          </div>
          <span className="text-sm font-semibold tracking-[0.2em]">XAI</span>
        </a>
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2 py-2 backdrop-blur-xl md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              data-magnetic
              className="rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              {l}
            </a>
          ))}
        </nav>
        <button
          data-magnetic
          className="hidden rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white/10 md:inline-flex"
        >
          Launch app
        </button>
      </div>
    </header>
  );
}
