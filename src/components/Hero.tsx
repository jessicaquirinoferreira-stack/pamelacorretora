import React, { useEffect, useMemo, useState } from 'react';
import { Search, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Particles } from './ui/Particles';
import { Spotlight } from './ui/Spotlight';
import { AnimatedShinyText } from './ui/AnimatedShinyText';
import { WordRotate } from './ui/WordRotate';
import { ShimmerButton } from './ui/ShimmerButton';

interface HeroProps {
  onSearch: (filters: {
    transactionType: string;
    condominium: string;
    bedrooms: string;
    maxPrice: string;
  }) => void;
  onOpenBooking: () => void;
  onScrollToProperties: () => void;
}

interface HeroSlide {
  url: string;
  title: string;
  condominium: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80',
    title: 'Apartamento Contemporâneo',
    condominium: 'Alpha Vita · Alphaville',
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80',
    title: 'Apartamento 3 Dormitórios',
    condominium: 'Jardins de Tamboré · Alphaville',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=80',
    title: 'Residência Mobiliada de Alto Padrão',
    condominium: 'Jardins de Tamboré · Alphaville',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80',
    title: 'Varanda Gourmet e Sala Ampliada',
    condominium: 'Alphaville · SP',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onOpenBooking,
  onScrollToProperties,
}) => {
  const { siteSettings, properties } = useData();
  const [transactionType, setTransactionType] = useState<'all' | 'sale' | 'rent'>('all');
  const [condominium, setCondominium] = useState<string>('all');
  const [bedrooms, setBedrooms] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<string>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Build slides dynamically from published developments' photos
  const slides = useMemo<HeroSlide[]>(() => {
    const published = properties.filter((p) => p.status === 'published');
    const seenUrls = new Set<string>();
    const collected: HeroSlide[] = [];

    for (const prop of published) {
      if (prop.coverImage && !seenUrls.has(prop.coverImage)) {
        seenUrls.add(prop.coverImage);
        collected.push({
          url: prop.coverImage,
          title: prop.title,
          condominium: `${prop.condominiumName} · ${prop.region}`,
        });
      }
    }

    // Add extra gallery angles if fewer than 4 developments are published
    if (collected.length < 4) {
      for (const prop of published) {
        for (const imgUrl of prop.gallery || []) {
          if (imgUrl && !seenUrls.has(imgUrl)) {
            seenUrls.add(imgUrl);
            collected.push({
              url: imgUrl,
              title: prop.title,
              condominium: `${prop.condominiumName} · ${prop.region}`,
            });
            if (collected.length >= 6) break;
          }
        }
        if (collected.length >= 6) break;
      }
    }

    return collected.length > 0 ? collected : FALLBACK_SLIDES;
  }, [properties]);

  const safeIndex = slides.length > 0 ? activeSlideIndex % slides.length : 0;
  const currentSlide = slides[safeIndex] || FALLBACK_SLIDES[0];

  // Auto-advance slides with smooth cinematic intervals
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  // Preload the next slide image so transitions stay instantaneous
  useEffect(() => {
    if (slides.length <= 1) return;
    const nextSlide = slides[(safeIndex + 1) % slides.length];
    if (nextSlide?.url) {
      const img = new Image();
      img.src = nextSlide.url;
    }
  }, [safeIndex, slides]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      transactionType,
      condominium,
      bedrooms,
      maxPrice,
    });
    onScrollToProperties();
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden bg-[#2D3B32]">
      {/* Dynamic Development Photos Slideshow with Ken Burns & Crossfade Transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${safeIndex}-${currentSlide.url}`}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{
              opacity: 1,
              scale: 1.02,
              x: safeIndex % 2 === 0 ? ['0%', '1.2%'] : ['0%', '-1.2%'],
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.35, ease: 'easeInOut' },
              scale: { duration: 6.5, ease: 'easeOut' },
              x: { duration: 6.5, ease: 'easeInOut' },
            }}
            className="absolute inset-0 will-change-transform"
          >
            <img
              src={currentSlide.url}
              alt={`${currentSlide.title} — ${currentSlide.condominium}`}
              loading="eager"
              decoding="async"
              fetchPriority={safeIndex === 0 ? 'high' : 'auto'}
              className="w-full h-full object-cover object-center filter brightness-75 contrast-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Verde Sálvia Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3B32] via-[#2D3B32]/58 to-[#2D3B32]/82 pointer-events-none" />
        <div className="absolute inset-0 bg-[#2D3B32]/32 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Aceternity UI Spotlight Light Beam */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#E29578" />

      {/* Lightweight Ambient Particles */}
      <Particles className="z-0" quantity={24} color="#E29578" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Kicker with Animated Shiny Text */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-4 text-[#E29578] text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
          <AnimatedShinyText>Imóveis de Alto Padrão</AnimatedShinyText>
          <span aria-hidden="true" className="text-[#E29578]/70">·</span>
          <span>Alphaville / SP</span>
          <span aria-hidden="true" className="text-[#E29578]/70">·</span>
          <WordRotate
            words={['Atendimento Exclusivo', 'Visitas Privativas', 'Assessoria Completa', 'Discrição Absoluta']}
            duration={3000}
            className="text-[#FAF7F2] font-medium"
          />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#FAF7F2] tracking-tight leading-[1.1] mb-6">
          {siteSettings.heroHeadline || 'Encontre seu lugar em Alphaville.'}
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#FAF7F2]/90 font-light leading-relaxed mb-10">
          {siteSettings.heroSubheadline ||
            'Uma seleção de imóveis para comprar ou alugar, com atendimento exclusivo e acompanhamento personalizado por Pâmela Boccaletti.'}
        </p>

        {/* Interactive Search Container */}
        <div className="bg-[#FAF7F2] text-[#2D3B32] rounded-xl p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto border border-[#E3DACF] transition-all duration-300 hover:border-[#B55D3E]">
          {/* Transaction Type Segmented Control */}
          <div className="flex flex-wrap items-center justify-start gap-2 border-b border-[#E3DACF] pb-3 mb-4">
            <button
              type="button"
              onClick={() => setTransactionType('all')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-full cursor-pointer ${
                transactionType === 'all'
                  ? 'bg-[#586E5E] text-[#FAF7F2]'
                  : 'text-[#2D3B32]/80 hover:text-[#2D3B32] hover:bg-[#F3EDE4]'
              }`}
            >
              Todos os Imóveis
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-full cursor-pointer ${
                transactionType === 'sale'
                  ? 'bg-[#586E5E] text-[#FAF7F2]'
                  : 'text-[#2D3B32]/80 hover:text-[#2D3B32] hover:bg-[#F3EDE4]'
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('rent')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-full cursor-pointer ${
                transactionType === 'rent'
                  ? 'bg-[#586E5E] text-[#FAF7F2]'
                  : 'text-[#2D3B32]/80 hover:text-[#2D3B32] hover:bg-[#F3EDE4]'
              }`}
            >
              Alugar
            </button>
          </div>

          {/* Search Fields Grid */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2D3B32]/80 font-semibold mb-1">
                Condomínio / Região
              </label>
              <select
                value={condominium}
                onChange={(e) => setCondominium(e.target.value)}
                className="w-full bg-[#F3EDE4] border border-[#E3DACF] rounded-lg px-3 py-2 text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
              >
                <option value="all">Todos em Alphaville</option>
                {Array.from(
                  new Set(
                    properties
                      .filter((p) => p.status === 'published' && p.condominiumName)
                      .map((p) => p.condominiumName)
                  )
                ).map((condo) => (
                  <option key={condo} value={condo}>
                    {condo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2D3B32]/80 font-semibold mb-1">
                Dormitórios
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-[#F3EDE4] border border-[#E3DACF] rounded-lg px-3 py-2 text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
              >
                <option value="all">Qualquer configuração</option>
                <option value="1">1 dormitório / suíte</option>
                <option value="2">2 dormitórios ou mais</option>
                <option value="3">3 dormitórios ou mais</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#2D3B32]/80 font-semibold mb-1">
                Faixa de Valor
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#F3EDE4] border border-[#E3DACF] rounded-lg px-3 py-2 text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
              >
                <option value="all">Todos os valores</option>
                <option value="10000">Locação até R$ 10.000/mês</option>
                <option value="1500000">Venda até R$ 1.500.000</option>
                <option value="2500000">Venda até R$ 2.500.000</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-[#E29578]" />
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Secondary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onScrollToProperties}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#FAF7F2] hover:text-[#E29578] transition-colors py-2 px-3 group cursor-pointer"
          >
            Explorar Imóveis
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[#FAF7F2]/35">|</span>
          <ShimmerButton
            onClick={onOpenBooking}
            background="#B55D3E"
            className="!py-2.5 !px-5 hover:brightness-95"
          >
            <Calendar className="w-4 h-4 text-[#FAF7F2]" />
            Agendar uma Visita
          </ShimmerButton>
        </div>
      </div>

      {/* Subtle Development Caption & Slideshow Progress Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 px-4">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#FAF7F2]/80 font-light text-center line-clamp-1">
            {currentSlide.condominium}
          </span>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Fotos dos empreendimentos">
            {slides.map((slide, idx) => (
              <button
                key={`${slide.url}-${idx}`}
                type="button"
                role="tab"
                aria-selected={idx === safeIndex}
                aria-label={`Ver empreendimento ${idx + 1}: ${slide.title}`}
                onClick={() => setActiveSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === safeIndex
                    ? 'w-7 bg-[#E29578]'
                    : 'w-2 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2]/75'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
