import { motion, useReducedMotion } from "framer-motion";
import { birthdayContent } from "../data/birthdayContent";
import PlaceholderText from "./PlaceholderText";
import MusicPlayer from "./MusicPlayer";

const ITEMS = [
  "feliz aniversário, Cecília",
  "quatorze anos de brilho",
  "mel, estrelas & memórias",
  "feito com carinho pra você",
];

// ATO 3 — fechamento calma: roxo profundo, pouco brilho, muito
// espaço negativo, o último recado e o player de música.
export default function FinalMessage() {
  const reduced = useReducedMotion();

  return (
    <section
      data-testid="final-message"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 25%, #2C1A4D 0%, #180E29 55%, #110A1F 100%)",
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-[#E9DDF7]"
          style={{
            left: `${(i * 83 + 17) % 100}%`,
            top: `${(i * 47 + 11) % 100}%`,
            width: 2,
            height: 2,
            animationDelay: `${i * 0.9}s`,
          }}
        />
      ))}

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-2xl flex-col items-center pb-10 text-center"
      >
        <p
          data-testid="final-eyebrow"
          className="font-round text-xs uppercase tracking-[0.4em] text-[#E8B34E] sm:text-sm"
        >
          antes de você ir
        </p>
        <h2
          data-testid="final-title"
          className="mt-5 font-display text-4xl font-black text-[#FBF8FF] sm:text-5xl"
        >
          um último recado
        </h2>

        <div className="mt-8 w-full">
          {/* ===============================
          // PLACEHOLDER: TEXTO FINAL
          // Substitua [TEXTO_FINAL] — edite
          // finalText em src/data/birthdayContent.js
          // =============================== */}
          <PlaceholderText
            value={birthdayContent.finalText}
            hintKey="finalText"
            className="font-display text-lg leading-relaxed text-[#E9DDF7] sm:text-xl"
          />
        </div>

        <div className="mt-12">
          <MusicPlayer />
        </div>
      </motion.div>

      <div
        data-testid="final-marquee"
        className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-[#E8B34E]/15 py-4"
      >
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex items-center">
              {ITEMS.map((t) => (
                <span
                  key={t}
                  className="mx-6 flex items-center gap-6 font-round text-[11px] uppercase tracking-[0.3em] text-[#E8B34E]/50"
                >
                  {t} <span className="text-[#F3A6C9]/60">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
