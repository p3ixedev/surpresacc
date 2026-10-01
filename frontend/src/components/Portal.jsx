import { useMemo } from "react";
import { motion, useTransform, useReducedMotion } from "framer-motion";

const COLORS = ["#E8B34E", "#E9DDF7", "#FBF8FF", "#F3A6C9", "#E8B34E"];

function Particle({ p, progress, end }) {
  const x = useTransform(progress, [0.02, end], [`${p.x}vw`, "0vw"]);
  const y = useTransform(progress, [0.02, end], [`${p.y}vh`, "0vh"]);
  const opacity = useTransform(
    progress,
    [0, 0.045, end - 0.05, end],
    [0, p.o, p.o * 0.85, 0]
  );
  const scale = useTransform(progress, [0.02, end], [1, 0.25]);

  return (
    <motion.span
      className="pointer-events-none absolute rounded-full"
      style={{
        left: "50%",
        top: "50%",
        width: p.s,
        height: p.s,
        backgroundColor: p.c,
        boxShadow: `0 0 ${p.glow}px ${p.c}`,
        x,
        y,
        opacity,
        scale,
        willChange: "transform, opacity",
      }}
    />
  );
}

// CAPÍTULO 1 — PORTAL: dezenas de partículas convergem para o
// centro, onde um anel luminoso se intensifica conforme o scroll.
export default function Portal({ progress, mobile }) {
  const reduced = useReducedMotion();
  const end = 0.24;
  const count = reduced ? 12 : mobile ? 24 : 46;

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n) => {
          const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
          return v - Math.floor(v);
        };
        const ang = r(1) * Math.PI * 2;
        const rad = 18 + r(2) * 34;
        return {
          x: Math.cos(ang) * rad * 1.25,
          y: Math.sin(ang) * rad,
          s: 2 + r(3) * 4,
          c: COLORS[i % COLORS.length],
          o: 0.5 + r(4) * 0.5,
          glow: 6 + r(5) * 8,
        };
      }),
    [count]
  );

  const wrapOpacity = useTransform(progress, [0.26, 0.31], [1, 0]);
  const ringOpacity = useTransform(progress, [0.06, 0.2], [0, 1]);
  const ringScale = useTransform(progress, [0.05, 0.26], [0.55, 1]);
  const textOpacity = useTransform(
    progress,
    [0.1, 0.17, 0.25, 0.29],
    [0, 1, 1, 0]
  );
  const textY = useTransform(progress, [0.1, 0.2], [14, 0]);

  return (
    <motion.div
      style={{ opacity: wrapOpacity }}
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
    >
      <div data-testid="portal-particles" className="absolute inset-0">
        {particles.map((p, i) => (
          <Particle key={i} p={p} progress={progress} end={end} />
        ))}
      </div>

      <motion.div
        data-testid="portal-ring"
        style={{ opacity: ringOpacity, scale: ringScale }}
        className="relative flex h-44 w-44 items-center justify-center sm:h-64 sm:w-64"
      >
        <div
          className="absolute -inset-8 rounded-full sm:-inset-12"
          style={{
            background:
              "radial-gradient(circle, rgba(232,179,78,0.32) 0%, rgba(243,166,201,0.12) 45%, transparent 70%)",
            filter: "blur(14px)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 45%, rgba(59,33,96,0.55) 0%, rgba(24,14,41,0.9) 55%, #180E29 100%)",
          }}
        />
        <div className="animate-breathe relative flex h-full w-full items-center justify-center">
          <div
            className="animate-spin-slower absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #E8B34E, #F3A6C9 22%, #E9DDF7 45%, #E8B34E 68%, #F3A6C9 88%, #E8B34E)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
            }}
          />
          <div
            className="animate-spin-slower-rev absolute inset-4 rounded-full opacity-70"
            style={{
              background:
                "conic-gradient(from 180deg, transparent, #E9DDF7 30%, transparent 55%, #E8B34E 80%, transparent)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
            }}
          />
          <span
            className="relative h-2.5 w-2.5 rounded-full bg-[#FBF8FF]"
            style={{ boxShadow: "0 0 18px 6px rgba(232,179,78,0.65)" }}
          />
        </div>
      </motion.div>

      <motion.p
        data-testid="portal-text"
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-20 mt-9 max-w-xs px-6 text-center font-soft text-sm leading-relaxed text-[#E9DDF7]/85 sm:max-w-md sm:text-base"
      >
        feche os olhos, respire, e role pra reviver esse dia
      </motion.p>
    </motion.div>
  );
}
