import React from 'react';
import { Instagram, Facebook, Calendar, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { BorderBeam } from './ui/BorderBeam';
import { motion } from 'motion/react';

interface AboutSectionProps {
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenBooking }) => {
  const { siteSettings } = useData();

  return (
    <section id="sobre" className="py-20 bg-[#f0ebe1] relative border-t border-b border-[#e8e2d9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photo & Badge Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative frame */}
              <div className="absolute -inset-3 border border-[#c5a880]/40 rounded-sm pointer-events-none transform -rotate-1" />

              {/* Image Container with BorderBeam */}
              <div className="relative bg-transparent rounded-sm overflow-hidden shadow-2xl">
                <img
                  src="https://i.postimg.cc/9QxD6mqT/Whats-App-Image-2026-11-10-at-20-40-05.jpg"
                  alt="Pâmela Boccaletti · Atendimento Imobiliário Exclusivo em Alphaville"
                  className="w-full h-auto object-cover filter contrast-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#192b20]/60 via-transparent to-transparent" />

                <BorderBeam size={250} duration={8} colorFrom="#c5a880" colorTo="#ffffff" />

                <div className="absolute bottom-5 left-5 right-5 text-[#fbf9f5]">
                  <div className="font-serif text-2xl font-medium tracking-wide">
                    {siteSettings.professionalName || 'Pâmela Boccaletti'}
                  </div>
                  <div className="text-xs text-[#c5a880] tracking-widest uppercase font-light">
                    Imóveis em Alphaville/SP · Atendimento Exclusivo
                  </div>
                </div>
              </div>

              {/* Floating Quote Badge */}
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#192b20] text-[#fbf9f5] p-4 rounded-sm shadow-xl border border-[#3b5242] max-w-xs">
                <p className="font-serif italic text-sm text-[#fbf9f5]/90 mb-2">
                  “Me chama e agende uma visita.”
                </p>
                <div className="text-[10px] uppercase tracking-widest text-[#c5a880]">
                  Atendimento Personalizado
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text & Ethos Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#819885] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              Apresentação Profissional
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#192b20] font-light leading-tight">
              Um atendimento pensado em você.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#192b20]/85 font-light leading-relaxed">
              <p>
                {siteSettings.bioDescription ||
                  'Sou Pâmela Boccaletti e atuo com imóveis em Alphaville/SP. Meu compromisso é oferecer atendimento exclusivo, entender suas prioridades e acompanhar você na busca pelo imóvel ideal.'}
              </p>

              <p>
                A busca por um imóvel em Alphaville envolve qualidade de vida, segurança, infraestrutura
                familiar e tranquilidade. Minha dedicação é proporcionar um contato direto, transparente
                e sem intermediários desnecessários, com foco em condomínios de referência como Alpha
                Vita e Jardins de Tamboré.
              </p>
            </div>

            {/* Core Values / Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 bg-white p-4 rounded-sm border border-[#e8e2d9] shadow-xs">
                <div className="p-2 bg-[#f0ebe1] rounded-sm text-[#192b20]">
                  <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#192b20]">
                    Atendimento Exclusivo
                  </h4>
                  <p className="text-xs text-[#192b20]/70 mt-0.5">
                    Acompanhamento próximo em cada etapa da pesquisa e visitação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-sm border border-[#e8e2d9] shadow-xs">
                <div className="p-2 bg-[#f0ebe1] rounded-sm text-[#192b20]">
                  <MapPin className="w-4 h-4 text-[#c5a880]" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-[#192b20]">
                    Foco em Alphaville
                  </h4>
                  <p className="text-xs text-[#192b20]/70 mt-0.5">
                    Conhecimento pontual da região e das dinâmicas dos condomínios.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels & CTA */}
            <div className="pt-4 border-t border-[#e8e2d9] flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4 text-[#c5a880]" />
                Agendar uma Visita
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href="https://www.instagram.com/pamelaboccaletti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#fbf9f5] border border-[#e8e2d9] text-[#192b20] text-xs rounded-full transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#c5a880]" />
                  <span>@pamelaboccaletti</span>
                </a>

                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#fbf9f5] border border-[#e8e2d9] text-[#192b20] text-xs rounded-sm transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#c5a880]" />
                  <span>Pamela Boccaletti</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
