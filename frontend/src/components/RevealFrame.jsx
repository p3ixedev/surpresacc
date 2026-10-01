import { motion, useTransform, useReducedMotion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { birthdayContent, isPlaceholder } from "../data/birthdayContent";

// CAPÍTULO 2 — REVELAÇÃO: o portal vira uma moldura que cresce com
// overshoot, leve rotação 3D e estrelas em órbita — como uma
// fotografia sendo revelada.
export default function RevealFrame({ progress, mobile }) {
  const reduced = useReducedMotion();
  const hasImage = !isPlaceholder(birthdayContent.ursinhoImage);

  const opacity = useTransform(
    progress,
    [0.315, 0.355, 0.49, 0.525],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    reduced ? [0.315, 0.42] : [0.315, 0.36, 0.4, 0.44],
    reduced ? [0.9, 1] : [0.55, 1.08, 0.97, 1]
  );
  const rotateX = useTransform(
    progress,
    [0.315, 0.43],
    reduced ? [0, 0] : [18, 0]
  );
  const y = useTransform(progress, [0.315, 0.43], [50, 0]);
  const capOpacity = useTransform(
    progress,
    [0.4, 0.45, 0.49, 0.52],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      <motion.div
        data-testid="reveal-frame"
        style={{ scale, rotateX, y, transformPerspective: 900 }}
        className="relative rounded-[2rem] border-2 border-dashed border-[#E8B34E]/75 p-3 shadow-[0_0_60px_rgba(232,179,78,0.22),0_30px_80px_rgba(0,0,0,0.5)]"
      >
        <div className="animate-spin-slower-rev pointer-events-none absolute -inset-9 sm:-inset-12">
          {[-90, -30, 30, 90, 150, 210].map((a) => {
            const rad = (a * Math.PI) / 180;
            return (
              <span
                key={a}
                className="absolute h-1.5 w-1.5 rounded-full bg-[#FBF8FF] shadow-[0_0_8px_rgba(233,221,247,0.9)]"
                style={{
                  left: `${50 + 52 * Math.cos(rad)}%`,
                  top: `${50 + 54 * Math.sin(rad)}%`,
                }}
              />
            );
          })}
        </div>

        <div className="w-[min(70vw,19rem)]">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-[#3B2160]/60 to-[#241541]">
            {hasImage ? (
              <img
                src={birthdayContent.ursinhoImage}
                alt="Ursinho da Cecília"
                data-testid="reveal-image"
                className="h-full w-full object-cover"
              />
            ) : (
              // ======================================
              // PLACEHOLDER: IMAGEM PRINCIPAL
              // Substitua [IMAGEM_URSINHO] pelo caminho
              // da imagem personalizada em
              // src/data/birthdayContent.js → ursinhoImage
              // ======================================
              <div
                data-testid="reveal-image-placeholder"
                className="flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-[#E9DDF7]/25 p-6 text-center"
              >
                <ImageIcon className="h-8 w-8 text-[#E8B34E]/80" />
                <span className="font-round text-sm leading-snug text-[#E9DDF7]/80">
                  coloque aqui a imagem do ursinho
                </span>
                <span className="font-soft text-[11px] leading-snug text-[#E9DDF7]/50">
                  birthdayContent.js → ursinhoImage
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.p
        data-testid="reveal-caption"
        style={{ opacity: capOpacity }}
        className="mt-7 max-w-md text-center font-serif2 text-base italic leading-relaxed text-[#E9DDF7]/90 sm:text-lg"
      >
        “cada aventura boba com você vale mais que mil perfeitas.”
      </motion.p>
    </motion.div>
  );
}
