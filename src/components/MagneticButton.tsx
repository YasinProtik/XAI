import { useRef, type ReactNode, type MouseEvent } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({ children, variant = "primary", onClick, className = "" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * 0.25}px, ${y * 0.35}px, 0)`;
    if (inner.current) inner.current.style.transform = `translate3d(${x * 0.15}px, ${y * 0.2}px, 0)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
    if (inner.current) inner.current.style.transform = "translate3d(0,0,0)";
  };

  const base =
    "relative inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-[background,border-color,box-shadow] duration-500 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-white text-[#060816] shadow-[0_10px_40px_-10px_rgba(120,180,255,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(120,180,255,0.8)]"
      : "border border-white/20 text-white/90 backdrop-blur-md hover:border-white/40 hover:bg-white/5";

  return (
    <button
      ref={ref}
      data-magnetic
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
      style={{ transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1), background 0.4s, border-color 0.4s, box-shadow 0.6s" }}
    >
      <span ref={inner} className="inline-flex items-center gap-2" style={{ transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.2, 1)" }}>
        {children}
      </span>
    </button>
  );
}
