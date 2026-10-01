// =====================================================
// 🎁 CENTRAL DE PERSONALIZAÇÃO
// "Um pequeno universo feito para Cecília"
//
// TODOS os textos, fotos e a música do site são
// editados SOMENTE NESTE ARQUIVO.
//
// Regras:
//   • Valores entre [COLCHETES] são placeholders —
//     o site mostra um aviso elegante no lugar deles.
//   • Troque pelos conteúdos reais mantendo as aspas.
// =====================================================

export const birthdayContent = {
  name: "Cecília",
  age: 14,

  // ATO 1 — texto principal de aniversário.
  // Texto de EXEMPLO abaixo: troque pela sua mensagem.
  openingText:
    "Hoje o mundo fica mais doce, porque é o seu dia. Respire fundo, ache o cantinho mais gostoso do seu coração e vem caminhar comigo pelas memórias que a gente já construiu — e por tudo que ainda vem por aí.",

  // CAPÍTULO 2 — imagem do ursinho (ex.: "/images/ursinho.png" ou uma URL)
  ursinhoImage: "[IMAGEM_URSINHO]",

  // CAPÍTULO 3 — fotos da galeria em órbita
  galleryImages: [
    "[FOTO_1]",
    "[FOTO_2]",
    "[FOTO_3]",
    "[FOTO_4]",
    "[FOTO_5]",
    "[FOTO_6]",
  ],

  // ATO 3 — último recado.
  // Texto de EXEMPLO abaixo: troque pela sua mensagem.
  finalText:
    "Se a vida é feita de pequenos momentos, obrigada por ser o mais brilhante deles. Que os seus 14 anos tragam coragem, doces surpresas e toda a luz que você espalha por aí. Eu te amo, Cecília.",

  // PLAYER — caminho ou URL do áudio (ex.: "/musica.mp3")
  music: "[MUSICA]",
};

// true quando o valor ainda é um placeholder [ASSIM]
export const isPlaceholder = (v) => !v || /^\s*\[.*\]\s*$/.test(String(v));
