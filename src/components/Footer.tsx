import React from 'react';
import { Instagram, Facebook, Lock, Phone, Mail, MapPin, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigate,
  onOpenBooking,
}) => {
  const { siteSettings } = useData();

  return (
    <footer className="bg-[#2D3B32] text-[#FAF7F2] border-t border-[#4D6254]">
      {/* Top Banner Callout */}
      <div className="bg-[#495C4E] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#5E7465]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#E29578] font-semibold">
            Atendimento Exclusivo em Alphaville/SP
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-light">
            Vamos encontrar seu próximo imóvel?
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/90 max-w-xl mx-auto leading-relaxed font-light">
            Agende uma conversa e receba atendimento dedicado para encontrar a melhor opção para sua
            família nos condomínios de Alphaville.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-8 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Agendar Visita com Pâmela
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Bio */}
          <div className="space-y-4">
            <img
              src={
                siteSettings.logoUrl ||
                'https://i.postimg.cc/bNDNFx92/Logo-Imobiliario-Dourado-Pamela-Boccaletti.png'
              }
              alt={siteSettings.professionalName || 'Pâmela Boccaletti'}
              className="h-14 sm:h-16 w-auto max-w-[240px] object-contain"
            />
            <p className="text-xs text-[#FAF7F2]/85 leading-relaxed font-light">
              Atendimento exclusivo e seleção de imóveis de alto padrão em Alphaville e Tamboré.
              Orientação personalizada do primeiro contato à concretização.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <a
                href={`https://www.instagram.com/${(siteSettings.instagramHandle || '@pamelaboccaletti').replace(/^@/, '')}/`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Instagram ${siteSettings.instagramHandle || '@pamelaboccaletti'}`}
                className="w-8 h-8 rounded-full bg-[#3B4D41] hover:bg-[#B55D3E] text-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Pamela Boccaletti"
                className="w-8 h-8 rounded-full bg-[#3B4D41] hover:bg-[#B55D3E] text-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E29578] font-semibold">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/85">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('comprar')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Imóveis à Venda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alugar')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Imóveis para Locação
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sobre')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Sobre Pâmela Boccaletti
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('alphaville')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Região de Alphaville
                </button>
              </li>
            </ul>
          </div>

          {/* Condominiums */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E29578] font-semibold">
              Condomínios em Destaque
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F2]/85">
              <li>
                <button
                  onClick={() => onNavigate('comprar')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Alpha Vita
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('comprar')}
                  className="hover:text-[#E29578] transition-colors cursor-pointer"
                >
                  Jardins de Tamboré
                </button>
              </li>
            </ul>
            {siteSettings.creciNumber && (
              <div className="text-[11px] text-[#C6D4C8] pt-2 border-t border-[#4D6254]">
                CRECI: <span className="font-mono">{siteSettings.creciNumber}</span>
              </div>
            )}
          </div>

          {/* Institutional & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-[#E29578] font-semibold">
              Canais Oficiais
            </h4>
            <div className="space-y-2 text-xs text-[#FAF7F2]/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E29578] mt-0.5 flex-shrink-0" />
                <span>{siteSettings.region || 'Alphaville / SP'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5 text-[#E29578] flex-shrink-0" />
                <span>{siteSettings.instagramHandle || '@pamelaboccaletti'}</span>
              </div>
              {siteSettings.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#E29578] flex-shrink-0" />
                  <span>{siteSettings.contactEmail}</span>
                </div>
              )}
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-[#C6D4C8] block">
                Agendamentos e visitas exclusivamente com horário prévio.
              </span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-8 border-t border-[#4D6254] text-[11px] text-[#C6D4C8] leading-relaxed space-y-2">
          <p>
            <strong className="text-[#FAF7F2]">Aviso de Transparência e Responsabilidade:</strong> As informações relativas a
            preços, metragens, taxas de condomínio, IPTU e disponibilidade foram extraídas de peças
            publicitárias históricas e estão estritamente sujeitas à confirmação com a corretora antes
            de qualquer tratativa. Não constitui promessa contratual ou garantia de valorização futura.
          </p>
          <p>
            <strong className="text-[#FAF7F2]">Proteção de Dados (LGPD) e Segurança:</strong> Em respeito à segurança patrimonial
            dos moradores e proprietários, os endereços exatos e numerações de unidades não são
            publicados na internet, sendo informados apenas pessoalmente em visita confirmada.
          </p>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="mt-8 pt-6 border-t border-[#3B4D41] flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F2]/75 gap-4">
          <div>
            © {new Date().getFullYear()} {siteSettings.professionalName || 'Pâmela Boccaletti'}. Todos os direitos reservados.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={() =>
                alert(
                  'Política de Privacidade: Seus dados cadastrados neste site são usados única e exclusivamente para contato imobiliário por Pâmela Boccaletti, sem compartilhamento com terceiros.'
                )
              }
              className="hover:text-[#E29578] transition-colors cursor-pointer"
            >
              Política de Privacidade & Termos
            </button>

            {/* Discreet Centered Admin Link as requested in Section 6 & 9 of prompt */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-[#FAF7F2]/75 hover:text-[#E29578] transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
