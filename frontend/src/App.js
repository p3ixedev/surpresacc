import React, { useEffect } from "react";
import Lenis from "lenis";
import Hero from "./components/Hero";
import ScrollJourney from "./components/ScrollJourney";
import FinalMessage from "./components/FinalMessage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: false };
  }
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#180E29",
            color: "#E9DDF7",
            fontFamily: "Quicksand, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          Algo se desfez no encanto... recarregue a página. 💜
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return (
    <ErrorBoundary>
      <main className="relative min-h-screen bg-[#180E29] font-soft text-[#FBF8FF]">
        <div className="grain-overlay" />
        <Hero />
        <ScrollJourney />
        <FinalMessage />
      </main>
    </ErrorBoundary>
  );
}
