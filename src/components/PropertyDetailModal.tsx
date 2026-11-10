import React, { useState } from 'react';
import { Property } from '../types';
import {
  X,
  Calendar,
  Share2,
  Check,
  AlertCircle,
  Home,
  Maximize2,
  Bed,
  Bath,
  Car,
  Package,
  Armchair,
  Utensils,
  Maximize,
  Copy,
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onBookVisit,
}) => {
  const { siteSettings } = useData();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) return null;

  const images = property.gallery && property.gallery.length > 0
    ? property.gallery
    : [property.coverImage];

  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formatted} / mês` : formatted;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#imovel/${property.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Confira este imóvel em Alphaville com Pâmela Boccaletti: ${property.title}`,
          url: shareUrl,
        });
      } catch {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleWhatsAppClick = () => {
    const rawNumber = siteSettings.whatsappNumber || '';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá, Pâmela! Vi o imóvel "${property.title}" (${property.condominiumName}) no seu site e gostaria de mais informações e de agendar uma visita.`
    );

    if (cleanNumber) {
      window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
    } else {
      // If WhatsApp number is not yet registered by the agent in settings, open booking form
      onBookVisit(property);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#192b20]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#fbf9f5] w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl border border-[#e8e2d9] flex flex-col max-h-[92vh] relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#e8e2d9] bg-[#fbf9f5]">
          <div>
            <span className="text-[11px] tracking-widest uppercase text-[#819885] font-semibold block">
              {property.condominiumName} · {property.region}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#192b20] font-medium leading-tight">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-[#192b20]/70 hover:text-[#192b20] hover:bg-[#f0ebe1] rounded-sm transition-colors"
              title="Compartilhar Imóvel"
              aria-label="Compartilhar imóvel"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#192b20]/70 hover:text-[#192b20] hover:bg-[#f0ebe1] rounded-sm transition-colors"
              aria-label="Fechar detalhes"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-8 flex-1">
          {/* Main Gallery Viewer */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#192b20] rounded-sm overflow-hidden">
              <img
                src={images[selectedImageIndex] || property.coverImage}
                alt={`${property.title} foto ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#192b20]/90 text-[#fbf9f5] text-xs px-3 py-1 font-medium tracking-wider uppercase">
                {property.transactionType === 'sale' ? 'Venda' : 'Locação'}
              </div>
              <div className="absolute bottom-3 right-3 bg-[#192b20]/80 text-[#fbf9f5] text-xs px-2.5 py-1 rounded-sm">
                {selectedImageIndex + 1} de {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#c5a880] ring-1 ring-[#c5a880]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pricing & Key Bar */}
          <div className="bg-[#f0ebe1] p-4 sm:p-5 rounded-sm flex flex-wrap items-center justify-between gap-4 border border-[#e8e2d9]">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#192b20]/70 font-medium block">
                Valor do Imóvel
              </span>
              <div className="font-serif text-3xl font-medium text-[#192b20]">
                {formatPrice(property.price, property.transactionType)}
              </div>
              {property.transactionType === 'rent' && (
                <span className="text-xs text-[#192b20]/60">
                  Despesas de condomínio e IPTU sob consulta prévia
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onBookVisit(property)}
                className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] px-5 py-3 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#c5a880]" />
                Agendar Visita
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="bg-[#c5a880] hover:bg-[#b8976b] text-[#192b20] px-5 py-3 rounded-sm text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
              >
                Contatar Corretora
              </button>
            </div>
          </div>

          {/* Pending Confirmation Disclaimer */}
          {property.pendingConfirmation && (
            <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-sm flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-medium">Anúncio histórico em processo de confirmação:</strong> Os
                valores e especificações exibidos foram obtidos de materiais publicitários recentes e estão
                sujeitos à confirmação direta de disponibilidade e condições vigentes com Pâmela Boccaletti.
              </div>
            </div>
          )}

          {/* Specifications Grid */}
          <div>
            <h3 className="font-serif text-xl text-[#192b20] font-medium mb-3">
              Especificações do Imóvel
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                <div className="flex items-center gap-2 text-[#819885] mb-1">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Área Privativa</span>
                </div>
                <div className="font-semibold text-[#192b20]">
                  {property.areaM2 ? `${property.areaM2} m²` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                <div className="flex items-center gap-2 text-[#819885] mb-1">
                  <Bed className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Dormitórios</span>
                </div>
                <div className="font-semibold text-[#192b20]">
                  {property.bedrooms !== undefined ? `${property.bedrooms} quartos` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                <div className="flex items-center gap-2 text-[#819885] mb-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Suítes</span>
                </div>
                <div className="font-semibold text-[#192b20]">
                  {property.suites !== undefined ? `${property.suites} suíte(s)` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                <div className="flex items-center gap-2 text-[#819885] mb-1">
                  <Car className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Vagas</span>
                </div>
                <div className="font-semibold text-[#192b20]">
                  {property.parkingSpots !== undefined ? `${property.parkingSpots} vagas` : 'A confirmar'}
                </div>
              </div>

              {property.storageUnit && (
                <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                  <div className="flex items-center gap-2 text-[#819885] mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Depósito</span>
                  </div>
                  <div className="font-semibold text-[#192b20]">No andar privativo</div>
                </div>
              )}

              {property.furnished && (
                <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                  <div className="flex items-center gap-2 text-[#819885] mb-1">
                    <Armchair className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Mobília</span>
                  </div>
                  <div className="font-semibold text-[#192b20]">Totalmente Mobiliado</div>
                </div>
              )}

              {property.gourmetBalcony && (
                <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                  <div className="flex items-center gap-2 text-[#819885] mb-1">
                    <Utensils className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Varanda</span>
                  </div>
                  <div className="font-semibold text-[#192b20]">Varanda Gourmet</div>
                </div>
              )}

              {property.expandedLivingRoom && (
                <div className="p-3 bg-white border border-[#e8e2d9] rounded-sm">
                  <div className="flex items-center gap-2 text-[#819885] mb-1">
                    <Maximize className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Living</span>
                  </div>
                  <div className="font-semibold text-[#192b20]">Sala Ampliada</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-xl text-[#192b20] font-medium mb-2">
              Descrição e Detalhes do Imóvel
            </h3>
            <p className="text-sm text-[#192b20]/80 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="font-serif text-xl text-[#192b20] font-medium mb-3">
                Destaques e Características
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[#192b20]/85">
                    <Check className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Private Address Protection Notice */}
          <div className="p-4 bg-[#f0ebe1] rounded-sm text-xs text-[#192b20]/75 border-l-2 border-[#c5a880]">
            <strong>Privacidade e Segurança:</strong> Em observância às diretrizes de segurança dos
            condomínios e privacidade dos proprietários, o endereço exato com número da unidade é
            disponibilizado exclusivamente mediante agendamento formal e confirmação prévia com Pâmela
            Boccaletti.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#fbf9f5] border-t border-[#e8e2d9] flex items-center justify-between">
          <div className="text-xs text-[#192b20]/60">
            Código do Imóvel: <span className="font-mono font-medium">{property.code || 'PB-ALPHA'}</span>
          </div>
          <button
            onClick={() => onBookVisit(property)}
            className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold py-2.5 px-6 rounded-sm transition-all"
          >
            Agendar Visita com Pâmela
          </button>
        </div>
      </div>
    </div>
  );
};
