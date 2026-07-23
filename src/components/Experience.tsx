import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ClientOnly } from "@/components/ClientOnly";
import { HeroScene } from "@/components/HeroScene";
import { CrystalScene } from "@/components/CrystalScene";
import { MagneticButton } from "@/components/MagneticButton";
import { Navbar } from "@/components/Navbar";
import { Cursor } from "@/components/Cursor";

/* ---------------- HERO ---------------- */

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const letterY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const letterScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const letterOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgress.current = v;
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* 3D world */}
        <div className="absolute inset-0">
          <ClientOnly>
            <HeroScene mouse={mouse} scrollProgress={scrollProgress} />
          </ClientOnly>
        </div>

        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(6,8,22,0.6) 70%, rgba(6,8,22,1) 100%)",
          }}
        />

        {/* Giant XAI as mask over 3D */}
        <motion.div
          style={{ y: letterY, scale: letterScale, opacity: letterOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <h1
            className="select-none text-center font-black leading-none tracking-tighter text-white/[0.04]"
            style={{
              fontSize: "clamp(10rem, 40vw, 40rem)",
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              fontFamily: "'Inter', system-ui, sans-serif",
              letterSpacing: "-0.06em",
            }}
          >
            XAI
          </h1>
        </motion.div>

        {/* Foreground content */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-20"
        >
          <div className="mb-10 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/50">
              Intelligence Workspace · v3.0
            </span>
          </div>
          <p className="mb-8 max-w-xl text-center text-sm text-white/50 md:text-base">
            The next generation AI workspace transforming information into
            insights, decisions and intelligent automation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              Explore Platform
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <MagneticButton variant="ghost">
              <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 4l14 8-14 8V4z" />
                </svg>
              </span>
              Watch Demo
            </MagneticButton>
          </div>
        </motion.div>

        {/* Top overlay tag */}
        <div className="absolute left-1/2 top-28 z-10 -translate-x-1/2">
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-white/60 backdrop-blur-xl">
            Turn Raw Data Into Intelligence
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/30"
        >
          Scroll
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- DATA JOURNEY ---------------- */

const stages = [
  {
    tag: "Stage 01",
    title: "Raw Data",
    desc: "Documents, APIs, spreadsheets and streams flow in from every corner of your operation.",
    items: ["CSV", "API", "DOCS", "IMG", "EMAIL"],
  },
  {
    tag: "Stage 02",
    title: "AI Processing",
    desc: "Neural systems dissolve, understand and reconstruct meaning from raw information.",
    items: ["EMBED", "REASON", "CLASSIFY", "ENRICH"],
  },
  {
    tag: "Stage 03",
    title: "Intelligence",
    desc: "Insights, dashboards and autonomous actions delivered in real time.",
    items: ["INSIGHTS", "REPORTS", "AUTOMATION", "ALERTS"],
  },
];

function DataJourney() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <section id="platform" ref={ref} className="relative h-[300vh] bg-[#060816]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="absolute left-8 top-24 z-10">
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">The Data Journey</div>
          <div className="mt-2 text-xs text-white/60">Horizontal · Scroll to explore</div>
        </div>

        <motion.div style={{ x }} className="flex h-full">
          {stages.map((s, i) => (
            <div key={i} className="flex h-screen w-screen shrink-0 items-center justify-center px-8">
              <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
                <div>
                  <div className="mb-6 text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-400/70">
                    {s.tag}
                  </div>
                  <h2 className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
                    {s.title}
                  </h2>
                  <p className="max-w-md text-base text-white/50">{s.desc}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {s.items.map((it) => (
                      <span
                        key={it}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/60 backdrop-blur-md"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
                <StageVisual stage={i} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StageVisual({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <div className="relative aspect-square w-full">
        {new Array(12).fill(0).map((_, i) => {
          const x = (i % 4) * 25;
          const y = Math.floor(i / 4) * 25;
          return (
            <motion.div
              key={i}
              className="absolute h-16 w-16 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-md"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
            >
              <div className="flex h-full w-full items-center justify-center text-[9px] font-medium text-white/40">
                {["CSV", "API", "DOC", "IMG", "PDF", "SQL"][i % 6]}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  }
  if (stage === 1) {
    return (
      <div className="relative aspect-square w-full">
        <div className="absolute inset-1/4 rounded-full border border-cyan-400/30" />
        <div className="absolute inset-[15%] rounded-full border border-purple-400/20" />
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(167,139,250,0.8) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {new Array(24).fill(0).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r = 40 + (i % 3) * 8;
          return (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-cyan-300"
              style={{
                x: Math.cos(angle) * r * 4,
                y: Math.sin(angle) * r * 4,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className="relative aspect-square w-full">
      <div className="grid h-full grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="text-[9px] uppercase tracking-widest text-white/40">Revenue</div>
          <div className="mt-2 text-2xl font-bold text-white">$2.4M</div>
          <div className="mt-4 flex h-12 items-end gap-1">
            {[30, 45, 60, 40, 70, 90, 75].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500 to-purple-500"
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="text-[9px] uppercase tracking-widest text-white/40">Accuracy</div>
          <div className="mt-2 text-2xl font-bold text-white">98.4%</div>
          <div className="mt-4 flex h-12 items-center">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "98%" }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-cyan-400"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="text-[9px] uppercase tracking-widest text-white/40">Automations Running</div>
          <div className="mt-3 space-y-2">
            {["Invoice categorization", "Lead scoring pipeline", "Sentiment monitor"].map((t, i) => (
              <div key={t} className="flex items-center justify-between text-xs text-white/70">
                <span>{t}</span>
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="text-cyan-400"
                >
                  ● live
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

type DashboardTab = "overview" | "data-sources" | "models" | "automations" | "insights" | "team";

const dashboardTabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "data-sources", label: "Data Sources" },
  { id: "models", label: "Models" },
  { id: "automations", label: "Automations" },
  { id: "insights", label: "Insights" },
  { id: "team", label: "Team" },
];

const dashboardContent: Record<
  DashboardTab,
  {
    stats: Array<{ l: string; v: string; d: string }>;
    chartTitle: string;
    chartSubtitle: string;
    chartValues: number[];
    tasksTitle: string;
    tasks: Array<{ t: string; s: string }>;
  }
> = {
  overview: {
    stats: [
      { l: "Active Signals", v: "12,842", d: "+18%" },
      { l: "Models Deployed", v: "34", d: "+3" },
      { l: "Tasks Automated", v: "1.2M", d: "+9%" },
    ],
    chartTitle: "Signal flow · 30d",
    chartSubtitle: "Workspace-wide activity over the last month.",
    chartValues: [28, 40, 52, 44, 60, 68, 56, 75, 70, 84, 78, 92],
    tasksTitle: "Recent AI Tasks",
    tasks: [
      { t: "Contract review", s: "done" },
      { t: "Forecast Q3", s: "run" },
      { t: "Cluster leads", s: "done" },
      { t: "Sentiment scan", s: "run" },
    ],
  },
  "data-sources": {
    stats: [
      { l: "Connected Sources", v: "18", d: "+4" },
      { l: "Freshness", v: "2m", d: "avg" },
      { l: "Ingest Errors", v: "0.2%", d: "stable" },
    ],
    chartTitle: "Source ingestion · 24h",
    chartSubtitle: "Dummy feed from APIs, docs, and file uploads.",
    chartValues: [16, 24, 30, 38, 42, 35, 48, 56, 50, 64, 60, 70],
    tasksTitle: "Source health",
    tasks: [
      { t: "CRM sync", s: "healthy" },
      { t: "Email parser", s: "healthy" },
      { t: "S3 sync", s: "delayed" },
      { t: "Webhook queue", s: "healthy" },
    ],
  },
  models: {
    stats: [
      { l: "Live Models", v: "14", d: "+2" },
      { l: "Avg Confidence", v: "96.8%", d: "+0.7" },
      { l: "Retrains", v: "6", d: "this week" },
    ],
    chartTitle: "Model confidence · 14d",
    chartSubtitle: "Dummy evaluation trend for active models.",
    chartValues: [62, 65, 68, 71, 74, 77, 80, 79, 83, 86, 89, 93],
    tasksTitle: "Model queue",
    tasks: [
      { t: "fraud-detector-v4", s: "serving" },
      { t: "forecast-net", s: "training" },
      { t: "embedding-v2", s: "serving" },
      { t: "classifier-lite", s: "shadow" },
    ],
  },
  automations: {
    stats: [
      { l: "Live Workflows", v: "42", d: "+8" },
      { l: "Success Rate", v: "99.2%", d: "+0.3" },
      { l: "Alerts Routed", v: "381", d: "+24" },
    ],
    chartTitle: "Automation throughput · 7d",
    chartSubtitle: "Dummy activity for approvals, alerts, and handoffs.",
    chartValues: [22, 32, 38, 45, 52, 58, 55, 63, 69, 72, 77, 83],
    tasksTitle: "Workflow status",
    tasks: [
      { t: "Invoice routing", s: "live" },
      { t: "Lead scoring", s: "live" },
      { t: "Escalation path", s: "queued" },
      { t: "Report dispatch", s: "live" },
    ],
  },
  insights: {
    stats: [
      { l: "Insights Generated", v: "4.8K", d: "+21%" },
      { l: "Trends Detected", v: "128", d: "+17" },
      { l: "Saved Decisions", v: "96", d: "this month" },
    ],
    chartTitle: "Insight velocity · 30d",
    chartSubtitle: "Dummy trend detection and recommendation volume.",
    chartValues: [26, 30, 40, 46, 51, 57, 61, 67, 71, 76, 82, 88],
    tasksTitle: "Insight feed",
    tasks: [
      { t: "Churn risk rising", s: "flag" },
      { t: "Top deal source: referrals", s: "trend" },
      { t: "Support volume peaks Fridays", s: "trend" },
      { t: "Pipeline conversion improving", s: "flag" },
    ],
  },
  team: {
    stats: [
      { l: "Active Members", v: "24", d: "+5" },
      { l: "Approvals Pending", v: "3", d: "now" },
      { l: "Handoffs", v: "58", d: "weekly" },
    ],
    chartTitle: "Team activity · 7d",
    chartSubtitle: "Dummy collaboration rhythm across the workspace.",
    chartValues: [14, 22, 33, 41, 38, 49, 46, 57, 61, 60, 66, 73],
    tasksTitle: "Team roster",
    tasks: [
      { t: "Alex - Product", s: "online" },
      { t: "Mina - ML", s: "review" },
      { t: "Jordan - Ops", s: "online" },
      { t: "Priya - Data", s: "offline" },
    ],
  },
};

function buildSmoothPath(values: number[], width = 640, height = 240, padding = 28) {
  if (values.length === 0) {
    return { line: "", area: "" };
  }

  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(maxValue - minValue, 1);

  const points = values.map((value, index) => {
    const x = padding + (innerWidth * index) / Math.max(values.length - 1, 1);
    const normalized = (value - minValue) / range;
    const y = height - padding - normalized * innerHeight;
    return { x, y };
  });

  const line = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const c1x = previous.x + (point.x - previous.x) / 2;
    const c1y = previous.y;
    const c2x = previous.x + (point.x - previous.x) / 2;
    const c2y = point.y;

    return `${path} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${point.x} ${point.y}`;
  }, "");

  const area = `${line} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return { line, area };
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const content = dashboardContent[activeTab];
  const chartPaths = buildSmoothPath(content.chartValues);

  return (
    <section id="solutions" className="relative bg-[#060816] py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">
            The Workspace
          </div>
          <h2 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Intelligence at a glance
          </h2>
          <p className="mt-6 text-white/50">
            A command center for teams that think in signals. Every metric, model
            and workflow — unified.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-2 backdrop-blur-xl"
          style={{ boxShadow: "0 40px 120px -30px rgba(120,180,255,0.25)" }}
        >
          <div className="grid grid-cols-12 gap-2">
            {/* Sidebar */}
            <aside className="col-span-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-6 flex items-center gap-2 px-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
                <div className="text-xs font-semibold text-white">Workspace</div>
              </div>
              <nav className="space-y-1">
                {dashboardTabs.map((tab) => {
                  const selected = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-pressed={selected}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                        selected
                          ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-8 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <div className="text-[9px] uppercase tracking-widest text-white/40">Usage</div>
                <div className="mt-2 text-lg font-bold text-white">72%</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="col-span-9 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {content.stats.map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-white/40">{m.l}</div>
                    <div className="mt-2 text-3xl font-bold text-white">{m.v}</div>
                    <div className="mt-1 text-xs text-cyan-400">{m.d}</div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="col-span-2 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-white">{content.chartTitle}</div>
                    <div className="flex gap-1">
                      {['1D', '7D', '30D'].map((range, i) => (
                        <div
                          key={range}
                          className={`rounded-full px-3 py-1 text-[10px] ${
                            i === 2 ? 'bg-white/10 text-white' : 'text-white/40'
                          }`}
                        >
                          {range}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="mb-4 text-xs text-white/40">{content.chartSubtitle}</p>
                  <div className="relative h-64 overflow-hidden rounded-2xl border border-white/5 bg-[#0a0e22]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_80%_35%,rgba(45,212,191,0.08),transparent_28%)]" />
                    <svg viewBox="0 0 640 240" className="relative h-full w-full">
                      <defs>
                        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="chartStroke" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#22d3ee" />
                          <stop offset="100%" stopColor="#67e8f9" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d={chartPaths.area}
                        fill="url(#chartFill)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.path
                        d={chartPaths.line}
                        fill="none"
                        stroke="url(#chartStroke)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: false }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                      />
                      {content.chartValues.map((value, index) => {
                        const x = 28 + (584 * index) / Math.max(content.chartValues.length - 1, 1);
                        const normalized = (value - Math.min(...content.chartValues)) /
                          Math.max(Math.max(...content.chartValues) - Math.min(...content.chartValues), 1);
                        const y = 240 - 28 - normalized * 184;

                        return (
                          <motion.circle
                            key={index}
                            cx={x}
                            cy={y}
                            r={index === content.chartValues.length - 2 ? 4 : 2.5}
                            fill="#22d3ee"
                            stroke="#0a0e22"
                            strokeWidth="2"
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false }}
                            transition={{ duration: 0.5, delay: index * 0.04 }}
                          />
                        );
                      })}
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="mb-4 text-sm font-medium text-white">{content.tasksTitle}</div>
                  <div className="space-y-3">
                    {content.tasks.map((task, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-white/70">{task.t}</span>
                        <span
                          className={`text-[9px] uppercase tracking-widest ${
                            task.s === "done" || task.s === "healthy" || task.s === "serving" || task.s === "online"
                              ? "text-white/40"
                              : task.s === "delayed" || task.s === "training" || task.s === "queued" || task.s === "review"
                                ? "text-amber-300"
                                : "text-cyan-400"
                          }`}
                        >
                          {task.s === "done" || task.s === "healthy" || task.s === "serving" || task.s === "online"
                            ? "✓"
                            : task.s === "delayed" || task.s === "training" || task.s === "queued" || task.s === "review"
                              ? "…"
                              : "●"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WOW MOMENT ---------------- */

function WowMoment() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => (progress.current = v));

  const textOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const textScale = useTransform(scrollYProgress, [0.6, 1], [0.3, 1.2]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section id="pricing" ref={ref} className="relative h-[300vh] bg-[#060816]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <ClientOnly>
            <CrystalScene progress={progress} />
          </ClientOnly>
        </div>

        <motion.div
          style={{ opacity: introOpacity }}
          className="absolute inset-x-0 top-32 z-10 text-center"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/70">
            Signature Moment
          </div>
          <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-bold tracking-tight text-white md:text-6xl">
            When intelligence takes shape
          </h2>
        </motion.div>

        <motion.h1
          style={{ opacity: textOpacity, scale: textScale }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-center font-black text-white"
        >
          <span
            style={{
              fontSize: "clamp(8rem, 30vw, 30rem)",
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              filter: "drop-shadow(0 0 60px rgba(167,139,250,0.5))",
            }}
          >
            XAI
          </span>
        </motion.h1>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/5 bg-[#060816] py-20">
      <div className="pointer-events-none absolute inset-0">
        {new Array(30).fill(0).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white/40"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-6">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-md opacity-60" />
            <div className="absolute inset-0 rounded-full border border-white/40" />
          </div>
          <span className="text-sm font-semibold tracking-[0.3em] text-white">XAI</span>
        </div>
        <p className="max-w-md text-center text-xs text-white/40">
          Intelligence Workspace. Built for teams that turn data into decisions.
        </p>
        <div className="flex gap-4">
          {["Twitter", "GitHub", "LinkedIn", "Discord"].map((s) => (
            <a
              key={s}
              href="#"
              data-magnetic
              className="text-[10px] uppercase tracking-[0.3em] text-white/40 transition hover:text-white"
            >
              {s}
            </a>
          ))}
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/20">
          © 2026 XAI Labs · All rights reserved
        </div>
      </div>
    </footer>
  );
}

/* ---------------- EXPORT ---------------- */

export function Experience() {
  const [smooth, setSmooth] = useState(false);
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    setSmooth(true);
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);
  void smooth;

  return (
    <div className="relative min-h-screen bg-[#060816] text-white antialiased">
      <ClientOnly>
        <Cursor />
      </ClientOnly>
      <Navbar />
      <main>
        <Hero />
        <DataJourney />
        <Dashboard />
        <WowMoment />
      </main>
      <Footer />
    </div>
  );
}
