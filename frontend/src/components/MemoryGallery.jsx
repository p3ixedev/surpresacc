import { useMemo } from "react";
import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Camera } from "lucide-react";
import { birthdayContent, isPlaceholder } from "../data/birthdayContent";

// Coreografia da galeria: cada polaroid entra de uma direção,
// encontra seu lugar na órbita e passeia com pequenas inclinações.
// No mobile a composição é própria — apertada e mais vertical.
const DESK = [
  { a0: -100, sweep: 115, rx: 30, ry: 24, tilt: -7, z: 30 },
  { a0: -35, sweep: 100, rx: 35, ry: 19, tilt: 6, z: 20 },
  { a0: 25, sweep: 110, rx: 30, ry: 25, tilt: -4, z: 30 },
  { a0: 85, sweep: 100, rx: 36, ry: 18, tilt: 8, z: 20 },
  { a0: 145, sweep: 110, rx: 30, ry: 24, tilt: -6, z: 30 },
  { a0: 205, sweep: 100, rx: 35, ry: 19, tilt: 5, z: 20 },
];

const MOB = [
  { a0: -95, sweep: 40, rx: 29, ry: 27, tilt: -8, z: 30 },
  { a0: -15, sweep: 36, rx: 33, ry: 25, tilt: 7, z: 20 },
  { a0: 60, sweep: 38, rx: 29, ry: 28, tilt: -5, z: 30 },
  { a0: 140, sweep: 36, rx: 33, ry: 25, tilt: 6, z: 20 },
];

const ENTRY = [
  { x: -72, y: 6 },
  { x: 72, y: -12 },
  { x: -10, y: -78 },
  { x: 14, y: 78 },
  { x: -66, y: -56 },
  { x: 66, y: 58 },
];

function buildKeyframes(i, mobile, reduced) {
  const cfg = mobile ? MOB[i % MOB.length] : DESK[i % DESK.length];
  const entry = ENTRY[i % ENTRY.length];
  const shrink = mobile ? 0.62 : 1;
  const e0 = 0.545 + i * (mobile ? 0.02 : 0.012);
  const e1 = e0 + (mobile ? 0.035 : 0.045);
  const sweep = reduced ? 0 : cfg.sweep;

  const pos = (t) => {
    const a = ((cfg.a0 + sweep * t) * Math.PI) / 180;
    return { x: Math.cos(a) * cfg.rx, y: Math.sin(a) * cfg.ry };
  };
  const pts = [pos(0), pos(0.25), pos(0.5), pos(0.75), pos(1)];

  const vx = (v) => `${v * shrink}vw`;
  const vy = (v) => `${v * shrink}vh`;

  const input = [e0, e1, 0.655, 0.685, 0.715, 0.745, 0.775];
  const xs = [vx(entry.x), ...pts.map((p) => vx(p.x)), vx(pts[3].x * 1.7)];
  const ys = [vy(entry.y), ...pts.map((p) => vy(p.y)), vy(pts[3].y * 1.7)];
  const rot = [
    cfg.tilt - 8,
    cfg.tilt,
    cfg.tilt + 4,
    cfg.tilt - 3,
    cfg.tilt + 2,
    cfg.tilt,
    cfg.tilt * 1.4,
  ];
  const scl = [0.7, 1, 0.97, 1.03, 1, 1, 0.82];
  const op = [0, 1, 1, 1, 1, 1, 0];

  return { input, xs, ys, rot, scl, op, z: cfg.z };
}

function Polaroid({ progress, k, idx, mobile }) {
  const x = useTransform(progress, k.input, k.xs);
  const y = useTransform(progress, k.input, k.ys);
  const rotate = useTransform(progress, k.input, k.rot);
  const scale = useTransform(progress, k.input, k.scl);
  const opacity = useTransform(progress, k.input, k.op);

  const src = birthdayContent.galleryImages[idx];
  const hasPhoto = !isPlaceholder(src);
  const w = mobile ? 96 : 160;

  return (
    <motion.div
      data-testid={`gallery-polaroid-${idx}`}
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        zIndex: k.z,
        willChange: "transform, opacity",
      }}
    >
      <div
        className="relative -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-[#FBF8FF] p-2 shadow-[0_22px_50px_rgba(0,0,0,0.5)]"
        style={{ width: w }}
      >
        <span className="absolute -top-2 left-1/2 z-10 h-4 w-10 -translate-x-1/2 -rotate-3 rounded-[2px] bg-[#F3A6C9]/60 shadow-sm" />
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[2px] bg-gradient-to-br from-[#3B2160] to-[#221335]">
          {hasPhoto ? (
            <img
              src={src}
              alt={`Memória ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <Camera className="h-5 w-5 text-[#E8B34E]/85" />
              <span className="font-round text-[10px] leading-none text-[#E9DDF7]/75">
                sua foto aqui
              </span>
            </>
          )}
        </div>
        <div style={{ height: mobile ? 14 : 22 }} />
      </div>
    </motion.div>
  );
}

// ======================================
// PLACEHOLDERS: FOTOS DA GALERIA
// Substitua [FOTO_1] ... [FOTO_6] em
// src/data/birthdayContent.js → galleryImages
// ======================================

// CAPÍTULO 3 — GALERIA EM ÓRBITA: um pequeno sistema solar de
// memórias coreografado pelo scroll.
export default function MemoryGallery({ progress, mobile }) {
  const reduced = useReducedMotion();
  const count = mobile ? 4 : 6;

  const keys = useMemo(
    () =>
      Array.from({ length: count }, (_, i) =>
        buildKeyframes(i, mobile, reduced)
      ),
    [count, mobile, reduced]
  );

  const glowOpacity = useTransform(
    progress,
    [0.56, 0.64, 0.73, 0.775],
    [0, 0.9, 0.9, 0]
  );
  const capOpacity = useTransform(
    progress,
    [0.6, 0.655, 0.73, 0.77],
    [0, 1, 1, 0]
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,179,78,0.25) 0%, rgba(243,166,201,0.1) 45%, transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      </motion.div>

      {keys.map((k, i) => (
        <Polaroid key={i} progress={progress} k={k} idx={i} mobile={mobile} />
      ))}

      <motion.p
        data-testid="gallery-caption"
        style={{ opacity: capOpacity }}
        className="absolute inset-x-0 bottom-[6%] px-8 text-center font-serif2 text-base italic leading-relaxed text-[#E9DDF7]/90 sm:text-lg"
      >
        “cada foto aqui é um pedacinho da nossa história.”
      </motion.p>
    </div>
  );
}
