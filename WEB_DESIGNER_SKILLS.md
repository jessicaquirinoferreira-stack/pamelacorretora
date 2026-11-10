# Catálogo Web Designer AI Pro — Pâmela Boccaletti | Imóveis em Alphaville

Catálogo de bibliotecas visuais, componentes, arquitetura de design, padrões de luxo imobiliário e integrações implementadas.

---

## Fontes Oficiais e Bibliotecas de Referência
- **React Bits**: https://www.reactbits.dev/
- **Magic UI**: https://magicui.design/
- **Aceternity UI**: https://ui.aceternity.com/
- **21st.dev**: https://21st.dev/
- **Lucide Icons**: https://lucide.dev/
- **Motion (Framer Motion v12)**: https://motion.dev/
- **Tailwind CSS v4**: https://tailwindcss.com/

---

## 1. Hero e Banners
- **Componentes**: `Hero`, `Spotlight`, `Particles`, `AnimatedShinyText`, `WordRotate`, `ShimmerButton`.
- **Efeitos Incorporados**:
  - **Aceternity UI Spotlight**: Feixe de iluminação radial dourado suave com animação fluida no topo do Hero.
  - **Magic UI Particles**: Partículas de luz ambiente flutuantes em canvas renderizadas com alto desempenho sem travar dispositivos móveis.
  - **Magic UI Animated Shiny Text**: Efeito de reflexo metálico em varredura suave nos kickers de alto padrão.
  - **Magic UI Word Rotate**: Transição animada de palavras-chave editoriais com blur e fade Y.
  - **Magic UI Shimmer Button**: Botão de CTA com sweep de brilho dinâmico e microinterações táteis.
- **Tipografia**: Serif clássica (`Cormorant Garamond`) + Sans geométrica moderna (`Plus Jakarta Sans`).
- **Paleta**: Verde oliva profundo (`#1E2E24`), terracota/areia suave (`#FBF9F5`), detalhes dourados sutis (`#C5A880`).

## 2. Navegação
- **Componentes**: `Navbar`, `FloatingContactBar` (21st.dev style).
- **Efeitos**: Header glassmorphism com transição de scroll, logo oficial de Pâmela Boccaletti com fundo transparente, barra flutuante retrátil que surge após rolagem com ações diretas de WhatsApp, agendamento e Instagram.
- **Acessibilidade**: Navegação com foco visível, teclado funcional, aria-labels para leitores de tela.

## 3. Botões
- **Componentes**: `ShimmerButton`, `PrimaryGoldButton`, `SecondaryOutlineButton`, `GhostIconButton`.
- **Efeitos**: Efeito shimmer metálico sweep, microinterações de escala ativa (`active:scale-95`), contraste WCAG AA preservado.

## 4. Cards Imobiliários
- **Componentes**: `PropertyCard`, `Card3D` (Aceternity UI).
- **Efeitos**: Efeito 3D tilt dinâmico sensível à posição do cursor do mouse com perspectiva tridimensional (`transformStyle: preserve-3d`), zoom suave na fotografia do imóvel, exibição de metadados sem enclausuramento em pílulas estáticas (separadores tipográficos com `·`), badge "Pendente de Confirmação" transparente para segurança jurídica dos anúncios históricos.

## 5. Busca e Filtros
- **Componentes**: `PropertyFilterBar`, `PriceRangeSlider`, `QuickSegmentTabs`.
- **Efeitos**: Segmented controls funcionais com transição animada, contagem instantânea de resultados, filtros por transação (Comprar/Alugar), condomínio (Alpha Vita, Jardins de Tamboré), dormitórios e preço.

## 6. Formulários
- **Componentes**: `VisitBookingModal`, `InlineContactForm`.
- **Efeitos**: Floating inputs elegantes, seletor de data e período preferencial, validação instantânea, gravação em tempo real no Firestore e link direto para WhatsApp formatado.

## 7. Animações
- **Biblioteca**: `motion` (v12).
- **Padrões**: Animações de entrada com stagger suave (`whileInView`, `viewport: { once: true }`), fades de opacidade e translação Y, respeitando `prefers-reduced-motion`.

## 8. Fundos
- **Padrões**: Gradientes sutis em tons terrosos, iluminação ambiente radial e partículas delicadas para sensação acolhedora e de seleção imobiliária de alto padrão.

## 9. Efeitos 3D e Parallax
- **Componentes**: `Card3D` aplicado aos cards de imóveis e oportunidades de destaque.

## 10. Tipografia
- **Títulos**: `Cormorant Garamond` (letras serifadas editoriais inspiradas em publicações de arquitetura).
- **Corpo & Dados**: `Plus Jakarta Sans` (leitura cristalina em dispositivos móveis e dashboards).

## 11. Galerias
- **Componentes**: `PropertyDetailModal`, `ThumbnailStrip`.
- **Efeitos**: Visualização de fotos em alta definição com troca suave de miniaturas e especificações completas.

## 12. Mapas e Região Alphaville
- **Componentes**: `AlphavilleGuide`.
- **Foco**: Jardins de Tamboré e Alpha Vita, sem invenção de dados geográficos ou distâncias falsas.

## 13. Gráficos e Métricas (Painel)
- **Componentes**: `AdminDashboard` Overview Cards.
- **Métricas Reais**: Contagem de imóveis cadastrados, imóveis à venda, imóveis para locação, solicitações de visita recebidas.

## 14. Painel Administrativo
- **Componentes**: `AdminDashboard`, `PropertyManager`, `LeadCRM`, `SiteSettingsManager`.
- **Recursos**: Cadastro de novos imóveis, alteração de status em tempo real, visualização de leads e solicitações de visitas, atualização de contatos oficiais (WhatsApp/telefone/CRECI) e URL do logo com pré-visualização ao vivo.

## 15. Conversão
- **Componentes**: CTA persistente de agendamento, modal rápido de visita, barra de contato flutuante de alta conversão.
