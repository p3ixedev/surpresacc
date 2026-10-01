import { isPlaceholder } from "../data/birthdayContent";

// Bloco de texto editável: mostra o texto real quando configurado
// (com uma etiqueta discreta "exemplo"), ou um aviso elegante
// enquanto o valor ainda for um placeholder [ASSIM].
export default function PlaceholderText({ value, hintKey, className = "" }) {
  const empty = isPlaceholder(value);

  return (
    <div data-testid="placeholder-text">
      {empty ? (
        <div className="mx-auto rounded-2xl border border-dashed border-[#E8B34E]/45 bg-white/[0.03] px-5 py-4">
          <p className="font-round text-sm leading-relaxed text-[#E9DDF7]/80">
            {value || "[TEXTO]"}
          </p>
          <span className="mt-2 block font-soft text-[11px] tracking-wide text-[#E8B34E]/80">
            edite em src/data/birthdayContent.js → {hintKey}
          </span>
        </div>
      ) : (
        <>
          <p className={className}>{value}</p>
          <span className="mt-3 block font-soft text-[10px] uppercase tracking-[0.25em] text-[#E8B34E]/45">
            mensagem de exemplo — edite em birthdayContent.js
          </span>
        </>
      )}
    </div>
  );
}
