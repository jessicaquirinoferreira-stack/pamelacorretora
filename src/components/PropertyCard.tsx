import React from 'react';
import { Property } from '../types';
import { Eye, Calendar, ArrowUpRight } from 'lucide-react';
import { Card3D } from './ui/Card3D';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onBookVisit,
}) => {
  const formatPrice = (price: number, type: 'sale' | 'rent') => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);

    return type === 'rent' ? `${formatted}/mês` : formatted;
  };

  return (
    <Card3D intensity={8} className="h-full">
      <article className="group bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:border-[#c5a880]/80">
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#192b20]">
          <img
            src={property.coverImage}
            alt={property.title}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Minimal Transaction Ribbon */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            <span className="bg-[#192b20]/90 text-[#fbf9f5] text-[10px] tracking-wider uppercase px-2.5 py-1 font-medium backdrop-blur-xs">
              {property.transactionType === 'sale' ? 'Venda' : 'Locação'}
            </span>
            {property.pendingConfirmation && (
              <span className="bg-[#fbf9f5]/95 text-[#192b20] text-[9px] tracking-wider uppercase px-2 py-0.5 font-medium border border-[#e8e2d9]">
                Dados a Confirmar
              </span>
            )}
          </div>

          {/* Hover Quick Action */}
          <div className="absolute inset-0 bg-[#192b20]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => onSelect(property)}
              className="bg-[#fbf9f5] text-[#192b20] hover:bg-[#c5a880] p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Ver Detalhes do Imóvel"
              aria-label={`Ver detalhes de ${property.title}`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onBookVisit(property)}
              className="bg-[#c5a880] text-[#192b20] hover:bg-[#b8976b] p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="Agendar Visita"
              aria-label={`Agendar visita para ${property.title}`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Location Kicker */}
            <div className="text-[11px] tracking-widest uppercase text-[#819885] font-medium mb-1">
              {property.condominiumName} · {property.region}
            </div>

            {/* Title */}
            <h3
              onClick={() => onSelect(property)}
              className="font-serif text-xl font-medium text-[#192b20] leading-snug line-clamp-2 cursor-pointer group-hover:text-[#3b5242] transition-colors mb-2"
            >
              {property.title}
            </h3>

            {/* Price */}
            <div className="text-lg font-semibold text-[#192b20] mb-3">
              {formatPrice(property.price, property.transactionType)}
            </div>

            {/* Technical Specs - Zero-pill discipline (unboxed text with ·) */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#192b20]/75 py-2 border-t border-b border-[#e8e2d9]/70 mb-4">
              {property.areaM2 ? (
                <>
                  <span>{property.areaM2} m²</span>
                  <span aria-hidden="true" className="text-[#c5a880]">·</span>
                </>
              ) : null}

              {property.bedrooms ? (
                <>
                  <span>{property.bedrooms} dorms</span>
                  <span aria-hidden="true" className="text-[#c5a880]">·</span>
                </>
              ) : null}

              {property.suites ? (
                <>
                  <span>{property.suites} suíte{property.suites > 1 ? 's' : ''}</span>
                  <span aria-hidden="true" className="text-[#c5a880]">·</span>
                </>
              ) : null}

              {property.parkingSpots ? (
                <>
                  <span>{property.parkingSpots} vagas</span>
                  {property.storageUnit && (
                    <>
                      <span aria-hidden="true" className="text-[#c5a880]">·</span>
                      <span>Depósito</span>
                    </>
                  )}
                  {property.furnished && (
                    <>
                      <span aria-hidden="true" className="text-[#c5a880]">·</span>
                      <span>Mobiliado</span>
                    </>
                  )}
                </>
              ) : (
                <span>Características sob consulta</span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onSelect(property)}
              className="text-xs uppercase tracking-wider font-semibold text-[#192b20] hover:text-[#c5a880] inline-flex items-center gap-1 group/btn cursor-pointer"
            >
              Conhecer Imóvel
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onBookVisit(property)}
              className="text-xs uppercase tracking-wider text-[#3b5242] hover:text-[#192b20] font-medium cursor-pointer"
            >
              Agendar Visita
            </button>
          </div>
        </div>
      </article>
    </Card3D>
  );
};
