import React from 'react';
import { Building2, Trees, ArrowRight } from 'lucide-react';
import { Meteors } from './ui/Meteors';
import { Card3D } from './ui/Card3D';
import { motion } from 'motion/react';

interface AlphavilleGuideProps {
  onFilterCondominium: (condoName: string) => void;
}

export const AlphavilleGuide: React.FC<AlphavilleGuideProps> = ({ onFilterCondominium }) => {
  return (
    <section id="alphaville" className="py-20 bg-[#192b20] text-[#fbf9f5] relative overflow-hidden">
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute inset-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=80"
          alt="Alphaville vista aérea"
          className="w-full h-full object-cover"
        />
      </div>

      <Meteors number={15} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a880] font-semibold block mb-2">
            Região de Atuação
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#fbf9f5]">
            Alphaville & Tamboré
          </h2>
          <p className="mt-4 text-sm text-[#fbf9f5]/80 font-light leading-relaxed">
            Sinônimo de bem-estar, condomínios com ampla área verde, segurança estruturada e
            qualidade de vida para você e sua família.
          </p>
        </motion.div>

        {/* Featured Condominiums Cards with Card3D */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Condomínio Alpha Vita */}
          <Card3D intensity={6} className="h-full">
            <div className="bg-[#243d2e]/90 border border-[#3b5242] p-8 rounded-sm backdrop-blur-xs flex flex-col justify-between hover:border-[#c5a880] transition-colors duration-300 h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] tracking-widest uppercase text-[#c5a880] font-medium">
                    Condomínio de Referência
                  </span>
                  <Building2 className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#fbf9f5] mb-3">
                  Alpha Vita
                </h3>
                <p className="text-xs text-[#fbf9f5]/80 leading-relaxed mb-6 font-light">
                  Destaca-se por sua estrutura de lazer completa, amplas áreas sociais e apartamentos com
                  plantas contemporâneas integradas à varanda. Uma opção muito procurada para quem deseja
                  conforto e acabamento refinado no coração de Alphaville.
                </p>
              </div>

              <button
                onClick={() => onFilterCondominium('Alpha Vita')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#c5a880] hover:text-[#fbf9f5] font-semibold transition-colors group cursor-pointer"
              >
                Ver Imóveis no Alpha Vita
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card3D>

          {/* Card 2: Jardins de Tamboré */}
          <Card3D intensity={6} className="h-full">
            <div className="bg-[#243d2e]/90 border border-[#3b5242] p-8 rounded-sm backdrop-blur-xs flex flex-col justify-between hover:border-[#c5a880] transition-colors duration-300 h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] tracking-widest uppercase text-[#c5a880] font-medium">
                    Condomínio de Referência
                  </span>
                  <Trees className="w-5 h-5 text-[#c5a880]" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#fbf9f5] mb-3">
                  Jardins de Tamboré
                </h3>
                <p className="text-xs text-[#fbf9f5]/80 leading-relaxed mb-6 font-light">
                  Reconhecido pela metragem privativa de 100 m² muito bem aproveitada, opções com 2 a 3
                  dormitórios, suítes, depósitos privativos no andar e vaga de garagem demarcada. Oferece
                  excelente opção tanto para moradia própria quanto para locação mobiliada.
                </p>
              </div>

              <button
                onClick={() => onFilterCondominium('Jardins de Tamboré')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#c5a880] hover:text-[#fbf9f5] font-semibold transition-colors group cursor-pointer"
              >
                Ver Imóveis no Jardins de Tamboré
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card3D>
        </div>
      </div>
    </section>
  );
};
