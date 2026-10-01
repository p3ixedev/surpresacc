import { useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { birthdayContent } from "../data/birthdayContent";
import PlaceholderText from "./PlaceholderText";

const EASE = [0.22, 1, 0.36, 1];

// ATO 1 — abertura calma. Sem animações controladas por scroll:
// apenas uma revelação suave no carregamento e pulso discreto.
export default function Hero() {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18 });
  const py = useSpring(my, { stiffness: 40, damping: 18 });

  const dots = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: `${(i * 61 + 13) % 100}%`,
        top: `${(i * 37 + 7) % 100}%`,
        size: 2 + ((i * 7) % 3),
        delay: `${(i % 6) * 0.7}s`,
      })),
    []
  );

  const onMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 14);
  };

  return (
    <section
      data-testid="hero"
      onMouseMove={onMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 18%, #2C1A4D 0%, #180E29 52%, #110A1F 100%)",
      }}
    >
      <motion.div style={{ x: px, y: py }} className="absolute inset-0">
        {dots.map((d, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-[#E9DDF7]"
            style={{
              left: d.left,
              top: d.top,
              width: d.size,
              height: d.size,
              animationDelay: d.delay,
              boxShadow: "0 0 6px rgba(233,221,247,0.8)",
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <div className="overflow-hidden pb-1">
          <motion.p
            data-testid="hero-eyebrow"
            initial={reduced ? false : { y: "120%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="font-round text-xs uppercase tracking-[0.4em] text-[#E8B34E] sm:text-sm"
          >
            para {birthdayContent.name}, {birthdayContent.age} anos
          </motion.p>
        </div>

        <h1 data-testid="hero-title" className="mt-6">
          <span className="block overflow-hidden pb-2">
            <motion.span
              initial={reduced ? false : { y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
              className="block font-display text-4xl font-light italic text-[#E9DDF7] sm:text-5xl"
            >
              Feliz
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-3">
            <motion.span
              initial={reduced ? false : { y: "115%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
              className="text-glow-cinema block font-display text-6xl font-black text-[#FBF8FF] sm:text-7xl lg:text-8xl"
            >
              aniversário 💜
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.85 }}
          className="mt-9 w-full max-w-xl"
        >
          {/* ===============================
          // PLACEHOLDER: TEXTO DE ANIVERSÁRIO
          // Substitua [TEXTO_ANIVERSARIO] — edite
          // openingText em src/data/birthdayContent.js
          // =============================== */}
          <PlaceholderText
            value={birthdayContent.openingText}
            hintKey="openingText"
            className="font-display text-lg leading-relaxed text-[#E9DDF7] sm:text-xl"
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 1.6 }}
        className="absolute inset-x-0 bottom-8 z-10 flex justify-center"
      >
        <span
          data-testid="scroll-hint"
          className="animate-soft-pulse font-soft text-[11px] uppercase tracking-[0.35em] text-[#E9DDF7]/60 sm:text-xs"
        >
          role para continuar ↓
        </span>
      </motion.div>
    </section>
  );
}
