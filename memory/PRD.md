# PRD — "Um pequeno universo feito para Cecília"

## Problema original (do usuário)
Criar um site de aniversário de página única, totalmente funcional e responsivo (React + Tailwind + Framer Motion, pt-BR) para Cecília, que faz 14 anos. A experiência deve parecer cinematográfica e interativa — uma carta pessoal transformada em obra digital — com 3 atos, animação vinculada ao progresso do scroll, placeholders claramente identificados para textos, fotos, imagem do ursinho e música, paleta roxo profundo + dourado mel + lilás + rosa suave, tipografia Fraunces/Playfair Display/Baloo 2/Quicksand, mobile-first, ~60fps, suporte a prefers-reduced-motion, player de música customizado (sem autoplay) e nenhuma referência à Disney/Winnie-the-Pooh.

## Personas
- **Cecília (14 anos)** — destinatária: abre o link no celular, vive a jornada calma → portal → revelação → galeria → clímax → recado final.
- **Presenteador(a)** — quem personaliza: edita um único arquivo (src/data/birthdayContent.js) para trocar textos, fotos, imagem do ursinho e música.

## Arquitetura
- Frontend apenas (React CRA + Tailwind 3 + Framer Motion 11 + lenis para scroll suave). Sem backend/DB (nada é persistido).
- `src/data/birthdayContent.js` — central de personalização (name, age, openingText, ursinhoImage, galleryImages[6], finalText, music) + helper `isPlaceholder`.
- `src/components/`: Hero (Ato 1, 100vh, revelação mascarada no load), ScrollJourney (650vh sticky, useScroll+useSpring), Portal (46/24/12 partículas convergindo + anel cônico giratório), RevealFrame (moldura com overshoot, rotateX, estrelas em órbita), MemoryGallery (6 polaroids desktop / 4 mobile, keyframes orbitais próprios por breakpoint), Celebration (explosão scroll-driven de 66/36 partículas + título com glow), FinalMessage (Ato 3 + marquee lento), MusicPlayer (botão dourado, barra scaleX, tempo, sem autoplay), PlaceholderText.
- `src/hooks/useIsMobile.js`; favicon SVG original (gota de mel + brilho); index.html pt-BR com Google Fonts.

## Requisitos principais (estáticos)
1. 3 atos contínuos, sem menus/cards/template.
2. Ato 2 com sticky 100vh e coreografia 100% dirigida pelo scroll (0→0.31 portal, 0.315→0.53 revelação, 0.545→0.775 galeria, 0.775→1 clímax).
3. Placeholders: [IMAGEM_URSINHO], [FOTO_1..6], [MUSICA] com estados de fallback elegantes; textos de exemplo claramente marcados ("mensagem de exemplo — edite em birthdayContent.js").
4. Mobile-first: composição orbital própria no mobile, menos partículas, sem overflow horizontal.
5. prefers-reduced-motion: partículas reduzidas, órbita/explosão simplificadas, animações CSS desligadas.
6. Performance: transform/opacity/scale apenas; will-change; spring global no progresso.

## Implementado (01/10/2026…)
- Todos os componentes acima, fontes, favicon, lenis, grão de cinema, marquee do Ato 3.
- Correções: comprimento dos ranges do useTransform (Polaroid), ease de array não suportado (Burst), posthog original restaurado byte a byte no index.html, overflow-x: clip para não quebrar o sticky.
- Verificado: desktop 1440x900 (hero, portal, revelação, galeria, clímax) e mobile 390x844 (hero, galeria, final), overflow-x=false em todas as passadas, player testado com WAV real (tocou, barra avançou, botão virou pause).

## Backlog / próximos (P0–P2)
- P0: usuário substitui placeholders reais (fotos, textos, música, imagem do ursinho).
- P1: gerar/comissionar ilustração original do ursinho (usuário optou por placeholder nesta fase).
- P1: música de fundo real + talvez botão de volume.
- P2: compartilhar via WhatsApp com preview (og:image dedicada), contador de dias, cartinha em tela cheia no clímax.

## Credenciais
Nenhuma — o site não tem login nem backend.
