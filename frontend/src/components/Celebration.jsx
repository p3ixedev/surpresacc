import { useMemo } from "react";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Heart, Star, Sparkles } from "lucide-react";
import { birthdayContent } from "../data/birthdayContent";

const IN = 0.775;

function Burst({ b, progress }) {
  const x = useTransform(progress, [IN, IN + 0.13], ["0vmax", `${b.dx}vmax`]);
  const y = useTransform(progress, [IN, IN + 0.13], ["0vmax", `${b.dy}vmax`]);
  const opacity = useTransform(
    progress,
    [IN, IN + 0.02, IN + 0.1, IN + 0.15],
    [0, 1, 0.9, 0]
  );
  const rotate = useTransform(progress, [IN, IN + 0.15], [b.r0, b.r1]);
  const scale = useTransform(progress, [IN, IN + 0.03, IN + 0.15], [0.3, 1.1, 0.6]);

  return (
    <motion.span
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ x, y, opacity, rotate, scale, willChange: "transform, opacity" }}
    >
      {b.el}
    </motion.span>
  );
}

const PALETTE = ["#E8B34E", "#F3A6C9", "#E9DDF7", "#FBF8FF"];

function makeBurst(i, n) {
  const r = (k) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const ang = (i / n) * Math.PI * 2 + r(1) * 0.5;
  const d = 22 + r(2) * 42;
  const dx = Math.cos(ang) * d;
  const dy = Math.sin(ang) * d * 0.85;
  const kind = i % 5;
  const size = 8 + Math.round(r(3) * 10);
  const c = PALETTE[i % 4];

  let el;
  if (kind === 0) {
    el = <Heart size={size + 6} strokeWidth={0} fill="#F3A6C9" style={{ color: "#F3A6C9" }} />;
  } else if (kind === 1) {
    el = <Star size={size} strokeWidth={0} fill="#E8B34E" style={{ color: "#E8B34E" }} />;
  } else if (kind === 2) {
    const s = size / 2 + 3;
    el = (
      <span
        className="rounded-full"
        style={{ width: s, height: s, background: c, boxShadow: `0 0 10px ${c}` }}
      />
    );
  } else if (kind === 3) {
    el = <span style={{ width: 6, height: 12, borderRadius: 2, background: c }} />;
  } else {
    el = <Sparkles size={size} strokeWidth={1.5} style={{ color: c }} />;
  }

  return { dx, dy, r0: r(4) * 360, r1: r(4) * 360 + 180, el };
}

// CAPÍTULO 4 — CLÍMAX: explosão cinematográfica controlada pelo
// scroll, seguida da mensagem principal. Depois do pico, a
// intensidade diminui para preparar o Ato 3.
export default function Celebration({ progress, mobile }) {
  const reduced = useReducedMotion();
  const n = reduced ? 0 : mobile ? 36 : 66;
  const bursts = useMemo(
    () => Array.from({ length: n }, (_, i) => makeBurst(i, n)),
    [n]
  );

  const darkOpacity = useTransform(
    progress,
    [0.76, 0.82, 0.93, 1],
    [0, 0.5, 0.5, 0.12]
  );
  const flashOpacity = useTransform(progress, [0.775, 0.79, 0.825], [0, 0.8, 0]);
  const titleOpacity = useTransform(
    progress,
    [0.8, 0.845, 0.945, 0.99],
    [0, 1, 1, 0]
  );
  const titleScale = useTransform(
    progress,
    [0.8, 0.875, 0.905, 0.965],
    [0.5, 1.16, 1, 1.03]
  );
  const titleY = useTransform(progress, [0.8, 0.87], [20, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <motion.div style={{ opacity: darkOpacity }} className="absolute inset-0 bg-[#0B0616]" />

      <motion.div
        style={{ opacity: flashOpacity }}
        className="absolute inset-0"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(251,248,255,0.9) 0%, rgba(232,179,78,0.5) 30%, transparent 65%)",
          }}
        />
      </motion.div>

      <div data-testid="celebration-burst" className="absolute inset-0">
        {bursts.map((b, i) => (
          <Burst key={i} b={b} progress={progress} />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.h2
          data-testid="celebration-title"
          style={{ opacity: titleOpacity, scale: titleScale, y: titleY }}
          className="text-glow-cinema text-center font-display text-4xl font-black leading-tight text-[#FBF8FF] sm:text-6xl lg:text-7xl"
        >
          Feliz aniversário, {birthdayContent.name} 💜
        </motion.h2>
      </div>
    </div>
  );
}
