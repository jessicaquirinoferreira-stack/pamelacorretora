import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Copy,
  Film,
  Instagram,
  Maximize2,
  Bed,
  Bath,
  Car,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { LandingPage, Property } from '../types';
import { useData } from '../context/DataContext';

interface LandingPageViewProps {
  landingPage: LandingPage;
  property?: Property;
  onExit: () => void;
  onOpenBooking: (propertyId?: string, propertyTitle?: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  landingPage,
  property,
  onExit,
  onOpenBooking,
}) => {
  const { siteSettings, submitLead } = useData();
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Direct VIP Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMessage, setLeadMessage] = useState(
    `Tenho interesse no empreendimento "${landingPage.headline}". Gostaria de receber mais informações e horários disponíveis.`
  );
  const [leadSent, setLeadSent] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);

  const shareUrl = `${window.location.origin}/?lp=${encodeURIComponent(landingPage.slug)}`;
  const rawNumber = siteSettings.whatsappNumber || '';
  const cleanNumber = rawNumber.replace(/\D/g, '');
  const igUsername = (siteSettings.instagramHandle || '@pamelaboccaletti').replace(/^@/, '').trim();

  // Merge gallery & videos from landing page and linked property
  const photos = Array.from(
    new Set(
      [
        landingPage.coverImage,
        ...(landingPage.gallery || []),
        ...(property?.coverImage ? [property.coverImage] : []),
        ...(property?.gallery || []),
      ].filter(Boolean)
    )
  );

  const videos = Array.from(
    new Set(
      [
        ...(landingPage.videoUrl ? [landingPage.videoUrl] : []),
        ...(property?.videos || []),
      ].filter(Boolean)
    )
  );

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
    return type === 'rent' ? `${formatted} / mês` : formatted;
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;
    setLeadLoading(true);
    try {
      await submitLead({
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        propertyId: property?.id || landingPage.propertyId,
        propertyTitle: property?.title || landingPage.headline,
        message: leadMessage,
        preferredContactTime: 'Qualquer horário',
        utmSource: 'landing-page',
        utmCampaign: landingPage.slug,
      });
      setLeadSent(true);
    } catch (err) {
      console.error('Erro ao enviar contato da landing page:', err);
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D3B32] flex flex-col">
      {/* Top Minimal Luxury Bar */}
      <header className="sticky top-0 z-40 bg-[#2D3B32]/95 backdrop-blur-md text-[#FAF7F2] border-b border-[#4D6254]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#C6D4C8] hover:text-[#FAF7F2] px-3 py-1.5 rounded-full bg-[#3B4D41] hover:bg-[#495C4E] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfólio Completo</span>
              <span className="sm:hidden">Voltar</span>
            </button>
            <img
              src={
                siteSettings.logoUrl ||
                'https://i.postimg.cc/bNDNFx92/Logo-Imobiliario-Dourado-Pamela-Boccaletti.png'
              }
              alt={siteSettings.professionalName}
              className="h-10 sm:h-12 w-auto object-contain hidden xs:block"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-full bg-[#3B4D41] hover:bg-[#495C4E] text-[#FAF7F2] transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E29578]" />
                  <span>Link Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#E29578]" />
                  <span className="hidden sm:inline">Compartilhar</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenBooking(property?.id || landingPage.propertyId, property?.title || landingPage.headline)
              }
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold px-4 sm:px-5 py-2 rounded-full bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] transition-colors cursor-pointer shadow"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agendar Visita</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section of the Landing Page */}
      <section className="relative min-h-[78vh] flex items-end pb-14 pt-24 overflow-hidden bg-[#2D3B32]">
        {landingPage.videoUrl ? (
          <video
            src={landingPage.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            poster={landingPage.coverImage}
            className="absolute inset-0 w-full h-full object-cover filter brightness-75"
          />
        ) : (
          <img
            src={landingPage.coverImage || property?.coverImage}
            alt={landingPage.headline}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D3B32] via-[#2D3B32]/55 to-[#2D3B32]/40" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#E29578] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{landingPage.badgeText || 'Seleção Exclusiva Alphaville'}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#FAF7F2] leading-[1.08]">
              {landingPage.headline}
            </h1>

            <p className="text-base sm:text-lg text-[#FAF7F2]/90 font-light leading-relaxed max-w-2xl">
              {landingPage.subheadline}
            </p>

            {/* Quick Property Metrics Strip */}
            {property && (
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#FAF7F2] border-t border-[#FAF7F2]/20">
                <div className="font-serif text-2xl sm:text-3xl text-[#E29578] font-medium">
                  {formatPrice(property.price, property.transactionType)}
                </div>
                <span className="text-[#FAF7F2]/40 hidden sm:inline">|</span>
                <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider text-[#C6D4C8]">
                  {property.areaM2 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-[#E29578]" /> {property.areaM2} m²
                    </span>
                  ) : null}
                  {property.bedrooms ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#E29578]" /> {property.bedrooms} dorms
                    </span>
                  ) : null}
                  {property.suites ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#E29578]" /> {property.suites} suítes
                    </span>
                  ) : null}
                  {property.parkingSpots ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#E29578]" /> {property.parkingSpots} vagas
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <a
                href="#vip-contato"
                className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-7 py-3.5 rounded-full shadow-lg transition-all"
              >
                {landingPage.ctaText || 'Solicitar Apresentação Privativa'}
              </a>

              {cleanNumber && (
                <a
                  href={`https://wa.me/55${cleanNumber}?text=${encodeURIComponent(
                    `Olá, ${siteSettings.professionalName}! Vi a página exclusiva "${landingPage.headline}" (${shareUrl}) e gostaria de mais detalhes.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#2D3B32] text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded-full shadow-lg inline-flex items-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-[#9B4D32]" />
                  Conversar no WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Details, Highlights & Media Showcase */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        {/* Highlights & Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold block">
              Sobre o Empreendimento
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D3B32] font-light">
              {property?.title || landingPage.title}
            </h2>
            <p className="text-sm sm:text-base text-[#2D3B32]/85 leading-relaxed whitespace-pre-line">
              {property?.description || landingPage.subheadline}
            </p>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E3DACF] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-2xl text-[#2D3B32] font-medium border-b border-[#E3DACF] pb-3">
              Diferenciais Selecionados
            </h3>
            <ul className="space-y-3">
              {(landingPage.features?.length ? landingPage.features : property?.features || []).map(
                (feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#2D3B32]/90">
                    <Check className="w-4 h-4 text-[#9B4D32] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Videos Showcase */}
        {videos.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold inline-flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#9B4D32]" />
                Tour em Vídeo
              </span>
              <h2 className="font-serif text-3xl text-[#2D3B32] font-light mt-1">
                Conheça Cada Ambiente em Movimento
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((videoSrc, idx) => (
                <div
                  key={`${videoSrc}-${idx}`}
                  className="bg-[#2D3B32] rounded-2xl overflow-hidden shadow-lg border border-[#E3DACF]"
                >
                  <video
                    src={videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos Gallery */}
        {photos.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold block">
                Galeria Fotográfica
              </span>
              <h2 className="font-serif text-3xl text-[#2D3B32] font-light mt-1">
                Arquitetura e Acabamentos ({photos.length} fotos)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photoUrl, idx) => (
                <button
                  key={`${photoUrl}-${idx}`}
                  type="button"
                  onClick={() => setLightboxImage(photoUrl)}
                  className="group relative aspect-[16/10] rounded-xl overflow-hidden bg-[#2D3B32] border border-[#E3DACF] cursor-pointer shadow-xs hover:shadow-xl transition-all"
                >
                  <img
                    src={photoUrl}
                    alt={`${landingPage.headline} — Foto ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Direct VIP Inquiry Section */}
        <div
          id="vip-contato"
          className="bg-[#2D3B32] text-[#FAF7F2] rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl border border-[#4D6254]"
        >
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#E29578] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Atendimento Privativo
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#FAF7F2]">
              Receba o Dossiê Completo e Agende sua Visita
            </h2>
            <p className="text-sm text-[#C6D4C8] leading-relaxed">
              Atendimento direto com {siteSettings.professionalName}. Solicite disponibilidade atualizada,
              memorial descritivo e horários reservados com total discrição.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://www.instagram.com/${igUsername}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B4D41] hover:bg-[#495C4E] text-xs text-[#FAF7F2] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#E29578]" />
                @{igUsername}
              </a>
              {cleanNumber && (
                <a
                  href={`https://wa.me/55${cleanNumber}?text=${encodeURIComponent(
                    `Olá, ${siteSettings.professionalName}! Quero saber mais sobre "${landingPage.headline}".`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B4D41] hover:bg-[#495C4E] text-xs text-[#FAF7F2] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#E29578]" />
                  WhatsApp Oficial
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#FAF7F2] text-[#2D3B32] rounded-2xl p-6 shadow-xl">
            {leadSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E6ECE6] text-[#586E5E] mx-auto flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-medium">Solicitação Enviada!</h3>
                <p className="text-xs text-[#2D3B32]/80 max-w-sm mx-auto">
                  Recebemos seu contato. {siteSettings.professionalName} retornará pessoalmente em breve.
                </p>
                <button
                  type="button"
                  onClick={() => setLeadSent(false)}
                  className="text-xs font-semibold text-[#9B4D32] underline cursor-pointer pt-2"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <h3 className="font-serif text-xl font-medium text-[#2D3B32] mb-1">
                  Falar com {siteSettings.professionalName}
                </h3>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Seu nome completo *"
                  className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="WhatsApp com DDD *"
                    className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="E-mail (opcional)"
                    className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                </div>
                <textarea
                  rows={3}
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                />
                <button
                  type="submit"
                  disabled={leadLoading}
                  className="w-full bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold py-3 rounded-full transition-colors cursor-pointer shadow"
                >
                  {leadLoading ? 'Enviando...' : 'Receber Atendimento Exclusivo'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#2D3B32]/95 flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Fechar foto"
            className="absolute top-5 right-5 p-2.5 rounded-full bg-[#3B4D41] text-[#FAF7F2] hover:bg-[#B55D3E] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Visualização ampliada"
            className="max-w-full max-h-[88vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-[#2D3B32] text-[#C6D4C8] py-8 border-t border-[#4D6254] text-center text-xs px-4">
        <p className="text-[#FAF7F2] font-medium">
          © {new Date().getFullYear()} {siteSettings.professionalName} · {siteSettings.region}
        </p>
        <p className="mt-2 max-w-3xl mx-auto text-[11px] opacity-80">
          {siteSettings.legalDisclaimers}
        </p>
      </footer>
    </div>
  );
};
