import { useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";
import { birthdayContent, isPlaceholder } from "../data/birthdayContent";

// ===============================
// PLACEHOLDER: MÚSICA
// Substitua [MUSICA] pelo caminho
// ou URL do arquivo de áudio em
// src/data/birthdayContent.js → music
// ===============================

const fmt = (s) => {
  if (!s || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${String(ss).padStart(2, "0")}`;
};

export default function MusicPlayer() {
  const src = birthdayContent.music;
  const configured = !isPlaceholder(src);

  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) a.pause();
    else a.play().catch(() => {});
  };

  const pct = dur > 0 ? Math.min(time / dur, 1) : 0;

  return (
    <div
      data-testid="music-player"
      className="flex w-[min(88vw,26rem)] items-center gap-4 rounded-full border border-[#E8B34E]/25 bg-white/[0.04] px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      <button
        type="button"
        data-testid="music-toggle"
        onClick={configured ? toggle : undefined}
        disabled={!configured}
        aria-label={
          configured
            ? playing
              ? "Pausar música"
              : "Tocar música"
            : "Nenhuma música configurada"
        }
        className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E8B34E] to-[#d3902c] text-[#180E29] shadow-[0_0_24px_rgba(232,179,78,0.45)] transition-transform duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {configured ? (
          playing ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          )
        ) : (
          <Music className="h-5 w-5" />
        )}
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </button>

      {configured ? (
        <>
          <div className="flex-1" data-testid="music-progress">
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-[#E8B34E] to-[#F3A6C9]"
                style={{
                  transform: `scaleX(${pct})`,
                  transition: "transform 0.25s linear",
                }}
              />
            </div>
          </div>
          <span
            data-testid="music-time"
            className="font-soft text-[11px] tabular-nums text-[#E9DDF7]/70"
          >
            {fmt(time)} / {fmt(dur)}
          </span>
          <audio
            ref={audioRef}
            src={src}
            preload="metadata"
            data-testid="music-audio"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setTime(0);
            }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          />
        </>
      ) : (
        <span
          data-testid="music-placeholder"
          className="font-soft text-xs leading-snug text-[#E9DDF7]/60"
        >
          adicione uma música para completar a experiência ♫
        </span>
      )}
    </div>
  );
}
