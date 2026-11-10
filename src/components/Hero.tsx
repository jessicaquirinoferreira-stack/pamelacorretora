import React from 'react';
import { Search, Calendar, ChevronRight } from 'lucide-react';
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

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onOpenBooking,
  onScrollToProperties,
}) => {
  const { siteSettings } = useData();
  const [transactionType, setTransactionType] = React.useState<'all' | 'sale' | 'rent'>('all');
  const [condominium, setCondominium] = React.useState<string>('all');
  const [bedrooms, setBedrooms] = React.useState<string>('all');
  const [maxPrice, setMaxPrice] = React.useState<string>('all');

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
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#192b20]">
      {/* Background Architectural Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85"
          alt="Imóveis de Alto Padrão em Alphaville"
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#192b20] via-[#192b20]/60 to-[#192b20]/80" />
        <div className="absolute inset-0 bg-[#192b20]/30 mix-blend-multiply" />
      </div>

      {/* Aceternity UI Spotlight Light Beam */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#c5a880" />

      {/* Magic UI / React Bits Gentle Ambient Particles */}
      <Particles className="z-0" quantity={40} color="#c5a880" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        {/* Kicker with Animated Shiny Text */}
        <div className="inline-flex items-center gap-2 mb-4 text-[#c5a880] text-xs sm:text-sm tracking-[0.3em] uppercase font-light">
          <AnimatedShinyText>Imóveis de Alto Padrão</AnimatedShinyText>
          <span aria-hidden="true" className="text-[#c5a880]/60">·</span>
          <span>Alphaville / SP</span>
          <span aria-hidden="true" className="text-[#c5a880]/60">·</span>
          <WordRotate
            words={['Atendimento Exclusivo', 'Visitas Privativas', 'Assessoria Completa', 'Discrição Absoluta']}
            duration={3000}
            className="text-[#fbf9f5] font-medium"
          />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#fbf9f5] tracking-tight leading-[1.1] mb-6">
          {siteSettings.heroHeadline || 'Encontre seu lugar em Alphaville.'}
        </h1>

        {/* Subheadline */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#fbf9f5]/85 font-light leading-relaxed mb-10">
          {siteSettings.heroSubheadline ||
            'Uma seleção de imóveis para comprar ou alugar, com atendimento exclusivo e acompanhamento personalizado por Pâmela Boccaletti.'}
        </p>

        {/* Interactive Search Container */}
        <div className="bg-[#fbf9f5] text-[#192b20] rounded-sm p-4 sm:p-6 shadow-2xl max-w-4xl mx-auto border border-[#e8e2d9] transition-all duration-300 hover:border-[#c5a880]">
          {/* Transaction Type Segmented Control */}
          <div className="flex items-center justify-start space-x-2 border-b border-[#e8e2d9] pb-3 mb-4">
            <button
              type="button"
              onClick={() => setTransactionType('all')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-sm ${
                transactionType === 'all'
                  ? 'bg-[#192b20] text-[#fbf9f5]'
                  : 'text-[#192b20]/70 hover:text-[#192b20] hover:bg-[#f0ebe1]'
              }`}
            >
              Todos os Imóveis
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('sale')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-sm ${
                transactionType === 'sale'
                  ? 'bg-[#192b20] text-[#fbf9f5]'
                  : 'text-[#192b20]/70 hover:text-[#192b20] hover:bg-[#f0ebe1]'
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('rent')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 transition-all rounded-sm ${
                transactionType === 'rent'
                  ? 'bg-[#192b20] text-[#fbf9f5]'
                  : 'text-[#192b20]/70 hover:text-[#192b20] hover:bg-[#f0ebe1]'
              }`}
            >
              Alugar
            </button>
          </div>

          {/* Search Fields Grid */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#192b20]/70 font-medium mb-1">
                Condomínio / Região
              </label>
              <select
                value={condominium}
                onChange={(e) => setCondominium(e.target.value)}
                className="w-full bg-[#f0ebe1] border border-[#e8e2d9] rounded-sm px-3 py-2 text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
              >
                <option value="all">Todos em Alphaville</option>
                <option value="Alpha Vita">Alpha Vita</option>
                <option value="Jardins de Tamboré">Jardins de Tamboré</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#192b20]/70 font-medium mb-1">
                Dormitórios
              </label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-[#f0ebe1] border border-[#e8e2d9] rounded-sm px-3 py-2 text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
              >
                <option value="all">Qualquer configuração</option>
                <option value="1">1 dormitório / suíte</option>
                <option value="2">2 dormitórios ou mais</option>
                <option value="3">3 dormitórios ou mais</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#192b20]/70 font-medium mb-1">
                Faixa de Valor
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-[#f0ebe1] border border-[#e8e2d9] rounded-sm px-3 py-2 text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
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
                className="w-full bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer active:scale-98"
              >
                <Search className="w-4 h-4 text-[#c5a880]" />
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Secondary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onScrollToProperties}
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#fbf9f5] hover:text-[#c5a880] transition-colors py-2 px-3 group cursor-pointer"
          >
            Explorar Imóveis
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <span className="text-[#fbf9f5]/30">|</span>
          <ShimmerButton
            onClick={onOpenBooking}
            background="#c5a880"
            className="!py-2.5 !px-5"
          >
            <Calendar className="w-4 h-4 text-[#192b20]" />
            Agendar uma Visita
          </ShimmerButton>
        </div>
      </div>
    </section>
  );
};
