import { useRef } from "react";
import { useScroll, useSpring } from "framer-motion";
import Portal from "./Portal";
import RevealFrame from "./RevealFrame";
import MemoryGallery from "./MemoryGallery";
import Celebration from "./Celebration";
import { useIsMobile } from "../hooks/useIsMobile";

// ATO 2 — a jornada. Uma seção de 650vh com conteúdo preso na tela
// (sticky): o progresso do scroll dirige toda a coreografia.
export default function ScrollJourney() {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.5,
    restDelta: 0.0001,
  });

  return (
    <section
      ref={ref}
      data-testid="scroll-journey"
      className="relative"
      style={{
        height: "650vh",
        background:
          "radial-gradient(110% 80% at 50% 30%, #241543 0%, #180E29 55%, #120A20 100%)",
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <Portal progress={progress} mobile={isMobile} />
        <RevealFrame progress={progress} mobile={isMobile} />
        <MemoryGallery progress={progress} mobile={isMobile} />
        <Celebration progress={progress} mobile={isMobile} />
      </div>
    </section>
  );
}
