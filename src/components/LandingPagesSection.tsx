import React, { useState } from 'react';
import { LandingPage, Property } from '../types';
import { useData } from '../context/DataContext';
import { ArrowRight, Sparkles, Calendar, Check } from 'lucide-react';
import { Card3D } from './ui/Card3D';
import { motion } from 'motion/react';

interface LandingPagesSectionProps {
  onSelectProperty: (property: Property) => void;
  onOpenBooking: (propertyId?: string, propertyTitle?: string) => void;
}

export const LandingPagesSection: React.FC<LandingPagesSectionProps> = ({
  onSelectProperty,
  onOpenBooking,
}) => {
  const { landingPages, properties } = useData();

  const publishedPages = landingPages.filter((lp) => lp.status === 'published');

  if (publishedPages.length === 0) return null;

  return (
    <section className="py-16 bg-[#fbf9f5] border-t border-[#e8e2d9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-[#819885] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
            Campanhas Exclusivas
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#192b20] font-light">
            Oportunidades em Destaque
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#192b20]/70 font-light">
            Páginas dedicadas e seleção especial para os condomínios mais procurados de Alphaville.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedPages.map((lp, idx) => {
            const linkedProp = properties.find((p) => p.id === lp.propertyId);

            return (
              <motion.div
                key={lp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="h-full"
              >
                <Card3D intensity={6} className="h-full">
                  <div className="bg-white border border-[#e8e2d9] rounded-sm overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c5a880] transition-all flex flex-col justify-between h-full group">
                    <div className="relative aspect-[16/9] bg-[#192b20] overflow-hidden">
                      <img
                        src={lp.coverImage}
                        alt={lp.title}
                        className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#192b20]/90 text-[#fbf9f5] text-[10px] tracking-widest uppercase px-2.5 py-1 font-semibold backdrop-blur-xs">
                        Campanha Exclusiva
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-2xl text-[#192b20] font-medium leading-tight mb-2">
                          {lp.headline}
                        </h3>
                        <p className="text-xs text-[#192b20]/75 leading-relaxed mb-4">
                          {lp.subheadline}
                        </p>

                        {lp.features && lp.features.length > 0 && (
                          <div className="space-y-1.5 mb-6">
                            {lp.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-xs text-[#192b20]/80">
                                <Check className="w-3.5 h-3.5 text-[#c5a880] flex-shrink-0" />
                                <span>{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#e8e2d9] flex items-center justify-between gap-3">
                        {linkedProp ? (
                          <button
                            onClick={() => onSelectProperty(linkedProp)}
                            className="text-xs uppercase tracking-wider font-semibold text-[#192b20] hover:text-[#c5a880] inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            Ver Ficha Completa
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-xs text-[#192b20]/50">Oportunidade sob consulta</span>
                        )}

                        <button
                          onClick={() => onOpenBooking(lp.propertyId, lp.headline)}
                          className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                          Agendar Visita
                        </button>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
