import React from 'react';
import { Eye, Shield, Users, Clock, Award, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Card3D } from './ui/Card3D';

export const DifferentialsSection: React.FC = () => {
  const differentials = [
    {
      icon: Users,
      title: 'Atendimento Exclusivo',
      description:
        'Contato direto e personalizado com Pâmela Boccaletti, sem repasse para atendentes genéricos ou despersonalizados.',
    },
    {
      icon: Eye,
      title: 'Seleção Criteriosa',
      description:
        'Seleção de imóveis residenciais de qualidade em Alphaville, priorizando plantas inteligentes e acabamento diferenciado.',
    },
    {
      icon: Clock,
      title: 'Visitas com Pontualidade',
      description:
        'Agendamento planejado respeitando sua rotina, com orientações detalhadas sobre o condomínio e o entorno.',
    },
    {
      icon: Shield,
      title: 'Transparência e Sigilo',
      description:
        'Proteção absoluta de informações pessoais e endereço com discrição durante todas as etapas da visitação.',
    },
  ];

  return (
    <section className="py-20 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-[#586E5E] font-semibold block mb-2">
            Padrão de Atendimento
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D3B32] font-light">
            Diferenciais de um serviço dedicado
          </h2>
          <p className="mt-4 text-sm text-[#2D3B32]/80 font-light leading-relaxed">
            A busca pelo imóvel ideal em Alphaville deve ser uma experiência tranquila, segura e
            orientada às suas reais necessidades.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentials.map((diff, index) => {
            const Icon = diff.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card3D intensity={6} className="h-full">
                  <div className="bg-white border border-[#E3DACF] p-6 rounded-lg hover:border-[#B55D3E] transition-all duration-300 flex flex-col justify-between h-full hover:shadow-xl group">
                    <div>
                      <div className="w-10 h-10 bg-[#E6ECE6] text-[#9B4D32] flex items-center justify-center rounded-lg mb-4 group-hover:bg-[#586E5E] group-hover:text-[#FAF7F2] transition-colors duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-lg font-medium text-[#2D3B32] mb-2">
                        {diff.title}
                      </h3>
                      <p className="text-xs text-[#2D3B32]/80 leading-relaxed">
                        {diff.description}
                      </p>
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
