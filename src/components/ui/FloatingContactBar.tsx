import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Instagram } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface FloatingContactBarProps {
  onOpenBooking: () => void;
}

export const FloatingContactBar: React.FC<FloatingContactBarProps> = ({ onOpenBooking }) => {
  const { siteSettings } = useData();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  const rawNumber = siteSettings.whatsappNumber || '';
  const cleanNumber = rawNumber.replace(/\D/g, '');

  return (
    <aside
      aria-label="Ações rápidas de contato"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1.5 bg-[#2D3B32]/95 backdrop-blur-md border border-[#4D6254] rounded-full shadow-2xl transition-all duration-500 animate-fade-in"
    >
      <button
        onClick={onOpenBooking}
        className="flex items-center gap-2 px-4 py-2 bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
      >
        <Calendar className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Agendar Visita</span>
        <span className="sm:hidden">Visita</span>
      </button>

      {cleanNumber ? (
        <a
          href={`https://wa.me/55${cleanNumber}?text=${encodeURIComponent(
            'Olá, Pâmela! Gostaria de mais informações sobre imóveis em Alphaville.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 text-[#FAF7F2] hover:text-[#E29578] text-xs transition-colors"
          title="WhatsApp Oficial"
        >
          <Phone className="w-3.5 h-3.5 text-[#E29578]" />
          <span className="hidden md:inline">WhatsApp</span>
        </a>
      ) : null}

      <a
        href="https://www.instagram.com/pamelaboccaletti/"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-[#FAF7F2]/80 hover:text-[#E29578] transition-colors rounded-full"
        title="Instagram @pamelaboccaletti"
        aria-label="Instagram"
      >
        <Instagram className="w-4 h-4" />
      </a>
    </aside>
  );
};
