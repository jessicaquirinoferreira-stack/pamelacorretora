import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { Footer } from './components/Footer';
import { LandingPage, Property } from './types';
import { testConnection } from './lib/firebase';
import { Sparkles, Building2, Calendar, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { FloatingSocialButtons } from './components/ui/FloatingSocialButtons';
import { VirtualAssistant } from './components/ui/VirtualAssistant';
import { CinematicIntro } from './components/ui/CinematicIntro';

const AboutSection = lazy(() =>
  import('./components/AboutSection').then((m) => ({ default: m.AboutSection }))
);
const DifferentialsSection = lazy(() =>
  import('./components/DifferentialsSection').then((m) => ({ default: m.DifferentialsSection }))
);
const AlphavilleGuide = lazy(() =>
  import('./components/AlphavilleGuide').then((m) => ({ default: m.AlphavilleGuide }))
);
const LandingPagesSection = lazy(() =>
  import('./components/LandingPagesSection').then((m) => ({ default: m.LandingPagesSection }))
);
const PropertyDetailModal = lazy(() =>
  import('./components/PropertyDetailModal').then((m) => ({ default: m.PropertyDetailModal }))
);
const VisitBookingModal = lazy(() =>
  import('./components/VisitBookingModal').then((m) => ({ default: m.VisitBookingModal }))
);
const AdminDashboard = lazy(() =>
  import('./components/AdminPanel/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const LandingPageView = lazy(() =>
  import('./components/LandingPageView').then((m) => ({ default: m.LandingPageView }))
);

function getInitialLpSlugFromUrl(): string | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const qp = params.get('lp');
    if (qp) return qp;
    if (window.location.hash.startsWith('#lp/')) {
      return decodeURIComponent(window.location.hash.replace('#lp/', ''));
    }
  } catch {
    // ignore
  }
  return null;
}

function MainApp() {
  const { properties, siteSettings, landingPages } = useData();

  // Test Firestore connection on app mount
  useEffect(() => {
    testConnection();
  }, []);

  // UI Modals and Navigation States
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProp, setBookingProp] = useState<{ id: string; title: string } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [activeLandingPageSlug, setActiveLandingPageSlug] = useState<string | null>(() =>
    getInitialLpSlugFromUrl()
  );
  const [showIntro, setShowIntro] = useState<boolean>(() => !getInitialLpSlugFromUrl());

  useEffect(() => {
    const syncFromLocation = () => {
      setActiveLandingPageSlug(getInitialLpSlugFromUrl());
    };
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  // Properties Filter State
  const [filterTransaction, setFilterTransaction] = useState<'all' | 'sale' | 'rent'>('all');
  const [filterCondo, setFilterCondo] = useState<string>('all');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'area-desc'>('recent');

  const propertiesSectionRef = useRef<HTMLElement>(null);

  // Navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'comprar') {
      setFilterTransaction('sale');
      propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'alugar') {
      setFilterTransaction('rent');
      propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'destaques') {
      setFilterTransaction('all');
      propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Open booking modal
  const handleOpenBooking = (propertyId?: string, propertyTitle?: string) => {
    if (propertyId && propertyTitle) {
      setBookingProp({ id: propertyId, title: propertyTitle });
    } else {
      setBookingProp(null);
    }
    setIsBookingOpen(true);
  };

  // Filter properties logic
  const filteredProperties = properties
    .filter((prop) => {
      // Filter published status for public view
      if (prop.status !== 'published') return false;

      // Transaction type
      if (filterTransaction !== 'all' && prop.transactionType !== filterTransaction) {
        return false;
      }

      // Condominium
      if (filterCondo !== 'all' && prop.condominiumName !== filterCondo) {
        return false;
      }

      // Bedrooms
      if (filterBedrooms !== 'all') {
        const requiredBeds = Number(filterBedrooms);
        if (!prop.bedrooms || prop.bedrooms < requiredBeds) return false;
      }

      // Max price
      if (filterMaxPrice !== 'all') {
        const maxVal = Number(filterMaxPrice);
        if (prop.price > maxVal) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return (b.areaM2 || 0) - (a.areaM2 || 0);
      return a.order - b.order;
    });

  const handleOpenLandingPage = (lp: LandingPage) => {
    setActiveLandingPageSlug(lp.slug);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lp', lp.slug);
      window.history.pushState({}, '', url.toString());
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseLandingPage = () => {
    setActiveLandingPageSlug(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('lp');
      url.hash = '';
      window.history.pushState({}, '', url.toString());
    } catch {
      // ignore
    }
  };

  const activeLandingPage = activeLandingPageSlug
    ? landingPages.find((lp) => lp.slug === activeLandingPageSlug)
    : undefined;

  if (activeLandingPage) {
    const linkedProp = properties.find((p) => p.id === activeLandingPage.propertyId);
    return (
      <>
        <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2]" />}>
          <LandingPageView
            landingPage={activeLandingPage}
            property={linkedProp}
            onExit={handleCloseLandingPage}
            onOpenBooking={(id, title) => handleOpenBooking(id, title)}
          />
          {isBookingOpen && (
            <VisitBookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
              preselectedProperty={bookingProp}
            />
          )}
        </Suspense>
        <FloatingSocialButtons onOpenBooking={() => handleOpenBooking()} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2D3B32]">
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}
      {/* Fixed Luxury Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenBooking={(id, title) => handleOpenBooking(id, title)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onSearch={({ transactionType, condominium, bedrooms, maxPrice }) => {
          setFilterTransaction(transactionType as any);
          setFilterCondo(condominium);
          setFilterBedrooms(bedrooms);
          setFilterMaxPrice(maxPrice);
        }}
        onOpenBooking={() => handleOpenBooking()}
        onScrollToProperties={() => {
          propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Real Estate Listings Section */}
      <section
        id="imoveis"
        ref={propertiesSectionRef}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E3DACF] gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9B4D32]" />
              Catálogo Exclusivo
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D3B32] font-light">
              Imóveis Selecionados em Alphaville
            </h2>
            <p className="text-xs text-[#2D3B32]/80 mt-1">
              Exibindo {filteredProperties.length} de {properties.length} imóveis cadastrados
            </p>
          </div>

          {/* Interactive Filter Pills/Buttons - Segmented Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterTransaction('all')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterTransaction === 'all'
                  ? 'bg-[#586E5E] text-[#FAF7F2] shadow-xs'
                  : 'bg-white border border-[#E3DACF] text-[#2D3B32]/85 hover:text-[#2D3B32] hover:border-[#586E5E]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTransaction('sale')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterTransaction === 'sale'
                  ? 'bg-[#586E5E] text-[#FAF7F2] shadow-xs'
                  : 'bg-white border border-[#E3DACF] text-[#2D3B32]/85 hover:text-[#2D3B32] hover:border-[#586E5E]'
              }`}
            >
              À Venda
            </button>
            <button
              onClick={() => setFilterTransaction('rent')}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                filterTransaction === 'rent'
                  ? 'bg-[#586E5E] text-[#FAF7F2] shadow-xs'
                  : 'bg-white border border-[#E3DACF] text-[#2D3B32]/85 hover:text-[#2D3B32] hover:border-[#586E5E]'
              }`}
            >
              Para Locação
            </button>

            {/* Condominium Quick Selector */}
            <select
              value={filterCondo}
              onChange={(e) => setFilterCondo(e.target.value)}
              className="bg-white border border-[#E3DACF] text-xs text-[#2D3B32] px-4 py-1.5 rounded-full focus:outline-none focus:border-[#586E5E]"
            >
              <option value="all">Condomínio (Todos)</option>
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

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E3DACF] text-xs text-[#2D3B32] px-4 py-1.5 rounded-full focus:outline-none focus:border-[#586E5E]"
            >
              <option value="recent">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="area-desc">Maior Metragem</option>
            </select>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white border border-[#E3DACF] rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <Building2 className="w-10 h-10 text-[#586E5E] mx-auto mb-3" />
            <h3 className="font-serif text-xl font-medium text-[#2D3B32] mb-1">Nenhum imóvel encontrado</h3>
            <p className="text-xs text-[#2D3B32]/80 mb-4">
              Tente redefinir os filtros de condomínio ou valor para visualizar mais opções.
            </p>
            <button
              onClick={() => {
                setFilterTransaction('all');
                setFilterCondo('all');
                setFilterBedrooms('all');
                setFilterMaxPrice('all');
              }}
              className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full cursor-pointer transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              >
                <PropertyCard
                  property={property}
                  onSelect={(prop) => setSelectedProperty(prop)}
                  onBookVisit={(prop) => handleOpenBooking(prop.id, prop.title)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <Suspense fallback={null}>
        {/* Differentials Section */}
        <DifferentialsSection />

        {/* About Pâmela Boccaletti Section */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* Alphaville Guide (Alpha Vita & Jardins de Tamboré) */}
        <AlphavilleGuide
          onFilterCondominium={(condoName) => {
            setFilterCondo(condoName);
            propertiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Landing Pages / Campaign Showcase */}
        <LandingPagesSection
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onOpenLandingPage={(lp) => handleOpenLandingPage(lp)}
          onOpenBooking={(id, title) => handleOpenBooking(id, title)}
        />
      </Suspense>

      {/* Inline Direct Contact Section */}
      <section id="contato" className="py-16 bg-[#F3EDE4] border-t border-[#E3DACF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold block">
            Fale com a Corretora
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D3B32] font-light">
            Atendimento Pessoal e Personalizado
          </h2>
          <p className="text-xs sm:text-sm text-[#2D3B32]/85 max-w-xl mx-auto leading-relaxed">
            Prefere tirar dúvidas antes de agendar uma visita? Envie uma mensagem e receba a atenção
            exclusiva que seu momento de decisão merece.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleOpenBooking()}
              className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-6 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#E29578]" />
              Solicitar Agendamento de Visita
            </button>

            {siteSettings.whatsappNumber && (
              <a
                href={`https://wa.me/55${siteSettings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  'Olá, Pâmela! Gostaria de informações sobre imóveis em Alphaville.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-6 rounded-full shadow-md transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Conversar pelo WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      <Suspense fallback={null}>
        {/* Detail Modal */}
        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onBookVisit={(prop) => {
              setSelectedProperty(null);
              handleOpenBooking(prop.id, prop.title);
            }}
          />
        )}

        {/* Visit Booking Modal */}
        {isBookingOpen && (
          <VisitBookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            preselectedProperty={bookingProp}
          />
        )}

        {/* Admin Panel Dashboard */}
        {isAdminOpen && (
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            onPreviewLandingPage={(lp) => handleOpenLandingPage(lp)}
          />
        )}
      </Suspense>

      {/* Left-Side Virtual Assistant (Clara) */}
      <VirtualAssistant
        onOpenBooking={() => handleOpenBooking()}
        onNavigate={handleNavigate}
      />

      {/* Right-Side Official Social Floating Buttons (Instagram & WhatsApp) */}
      <FloatingSocialButtons onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
