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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D3B32]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-[#E3DACF] flex flex-col max-h-[92vh] relative">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E3DACF] bg-[#FAF7F2]">
          <div>
            <span className="text-[11px] tracking-widest uppercase text-[#586E5E] font-semibold block">
              {property.condominiumName} · {property.region}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl text-[#2D3B32] font-medium leading-tight">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-[#2D3B32]/75 hover:text-[#2D3B32] hover:bg-[#F3EDE4] rounded-full transition-colors cursor-pointer"
              title="Compartilhar Imóvel"
              aria-label="Compartilhar imóvel"
            >
              {copiedLink ? <Check className="w-5 h-5 text-[#586E5E]" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#2D3B32]/75 hover:text-[#2D3B32] hover:bg-[#F3EDE4] rounded-full transition-colors cursor-pointer"
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
            <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-[#2D3B32] rounded-lg overflow-hidden">
              <img
                src={images[selectedImageIndex] || property.coverImage}
                alt={`${property.title} foto ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#2D3B32]/90 text-[#FAF7F2] text-xs px-3 py-1 font-medium tracking-wider uppercase rounded-sm">
                {property.transactionType === 'sale' ? 'Venda' : 'Locação'}
              </div>
              <div className="absolute bottom-3 right-3 bg-[#2D3B32]/85 text-[#FAF7F2] text-xs px-2.5 py-1 rounded-sm">
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
                    className={`relative w-20 sm:w-24 aspect-[16/10] rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-[#B55D3E] ring-1 ring-[#B55D3E]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Uploaded Development Videos */}
            {property.videos && property.videos.length > 0 && (
              <div className="pt-3 space-y-2">
                <div className="text-xs uppercase tracking-wider font-semibold text-[#586E5E]">
                  Vídeos do Empreendimento ({property.videos.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.videos.map((videoUrl, vIdx) => (
                    <div
                      key={`${videoUrl}-${vIdx}`}
                      className="rounded-lg overflow-hidden bg-[#2D3B32] border border-[#E3DACF]"
                    >
                      <video
                        src={videoUrl}
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
          </div>

          {/* Pricing & Key Bar */}
          <div className="bg-[#F3EDE4] p-4 sm:p-5 rounded-lg flex flex-wrap items-center justify-between gap-4 border border-[#E3DACF]">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#2D3B32]/80 font-medium block">
                Valor do Imóvel
              </span>
              <div className="font-serif text-3xl font-medium text-[#2D3B32]">
                {formatPrice(property.price, property.transactionType)}
              </div>
              {property.transactionType === 'rent' && (
                <span className="text-xs text-[#2D3B32]/75">
                  Despesas de condomínio e IPTU sob consulta prévia
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onBookVisit(property)}
                className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] px-5 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E29578]" />
                Agendar Visita
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] px-5 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md cursor-pointer"
              >
                Contatar Corretora
              </button>
            </div>
          </div>

          {/* Pending Confirmation Disclaimer */}
          {property.pendingConfirmation && (
            <div className="p-3.5 bg-[#F9EBE5] border border-[#E29578]/60 rounded-lg flex items-start gap-3 text-xs text-[#2D3B32]">
              <AlertCircle className="w-4 h-4 text-[#9B4D32] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-[#9B4D32]">Anúncio histórico em processo de confirmação:</strong> Os
                valores e especificações exibidos foram obtidos de materiais publicitários recentes e estão
                sujeitos à confirmação direta de disponibilidade e condições vigentes com Pâmela Boccaletti.
              </div>
            </div>
          )}

          {/* Specifications Grid */}
          <div>
            <h3 className="font-serif text-xl text-[#2D3B32] font-medium mb-3">
              Especificações do Imóvel
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                  <Maximize2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Área Privativa</span>
                </div>
                <div className="font-semibold text-[#2D3B32]">
                  {property.areaM2 ? `${property.areaM2} m²` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                  <Bed className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Dormitórios</span>
                </div>
                <div className="font-semibold text-[#2D3B32]">
                  {property.bedrooms !== undefined ? `${property.bedrooms} quartos` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                  <Bath className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Suítes</span>
                </div>
                <div className="font-semibold text-[#2D3B32]">
                  {property.suites !== undefined ? `${property.suites} suíte(s)` : 'A confirmar'}
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                  <Car className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-medium">Vagas</span>
                </div>
                <div className="font-semibold text-[#2D3B32]">
                  {property.parkingSpots !== undefined ? `${property.parkingSpots} vagas` : 'A confirmar'}
                </div>
              </div>

              {property.storageUnit && (
                <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                  <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Depósito</span>
                  </div>
                  <div className="font-semibold text-[#2D3B32]">No andar privativo</div>
                </div>
              )}

              {property.furnished && (
                <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                  <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                    <Armchair className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Mobília</span>
                  </div>
                  <div className="font-semibold text-[#2D3B32]">Totalmente Mobiliado</div>
                </div>
              )}

              {property.gourmetBalcony && (
                <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                  <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                    <Utensils className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Varanda</span>
                  </div>
                  <div className="font-semibold text-[#2D3B32]">Varanda Gourmet</div>
                </div>
              )}

              {property.expandedLivingRoom && (
                <div className="p-3 bg-white border border-[#E3DACF] rounded-lg">
                  <div className="flex items-center gap-2 text-[#586E5E] mb-1">
                    <Maximize className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">Living</span>
                  </div>
                  <div className="font-semibold text-[#2D3B32]">Sala Ampliada</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-serif text-xl text-[#2D3B32] font-medium mb-2">
              Descrição e Detalhes do Imóvel
            </h3>
            <p className="text-sm text-[#2D3B32]/85 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Features Checklist */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="font-serif text-xl text-[#2D3B32] font-medium mb-3">
                Destaques e Características
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[#2D3B32]/85">
                    <Check className="w-4 h-4 text-[#9B4D32] flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security & Private Address Protection Notice */}
          <div className="p-4 bg-[#F3EDE4] rounded-lg text-xs text-[#2D3B32]/85 border border-[#E3DACF]">
            <strong className="text-[#2D3B32]">Privacidade e Segurança:</strong> Em observância às diretrizes de segurança dos
            condomínios e privacidade dos proprietários, o endereço exato com número da unidade é
            disponibilizado exclusivamente mediante agendamento formal e confirmação prévia com Pâmela
            Boccaletti.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E3DACF] flex items-center justify-between">
          <div className="text-xs text-[#2D3B32]/75">
            Código do Imóvel: <span className="font-mono font-semibold text-[#2D3B32]">{property.code || 'PB-ALPHA'}</span>
          </div>
          <button
            onClick={() => onBookVisit(property)}
            className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold py-2.5 px-6 rounded-full transition-all cursor-pointer"
          >
            Agendar Visita com Pâmela
          </button>
        </div>
      </div>
    </div>
  );
};
