import { useEffect, useRef } from "react";

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovering.current = !!t.closest("[data-magnetic],a,button");
      if (ring.current) {
        ring.current.style.width = hovering.current ? "56px" : "28px";
        ring.current.style.height = hovering.current ? "56px" : "28px";
        ring.current.style.borderColor = hovering.current ? "rgba(120,180,255,0.9)" : "rgba(255,255,255,0.5)";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (ring.current) {
        const size = ring.current.offsetWidth / 2;
        ring.current.style.transform = `translate3d(${pos.current.x - size}px, ${pos.current.y - size}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden rounded-full border transition-[width,height,border-color] duration-200 md:block"
        style={{ width: 28, height: 28, mixBlendMode: "difference" }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-white md:block"
        style={{ mixBlendMode: "difference" }}
      />
    </>
  );
}
