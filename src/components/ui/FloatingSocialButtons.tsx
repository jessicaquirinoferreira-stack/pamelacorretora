import React from 'react';
import { useData } from '../../context/DataContext';

interface FloatingSocialButtonsProps {
  onOpenBooking: () => void;
}

export const OfficialInstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="ig-official-grad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#FDF497" />
        <stop offset="5%" stopColor="#FDF497" />
        <stop offset="45%" stopColor="#FD5949" />
        <stop offset="60%" stopColor="#D6249F" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig-official-grad)" />
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="4.2"
      stroke="#FFFFFF"
      strokeWidth="1.75"
    />
    <circle cx="12" cy="12" r="3.5" stroke="#FFFFFF" strokeWidth="1.75" />
    <circle cx="16.6" cy="7.4" r="1.05" fill="#FFFFFF" />
  </svg>
);

export const OfficialWhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.07 8.92C21.19 7.03 18.68 6 16.02 6C10.52 6 6.04 10.48 6.04 15.98C6.04 17.74 6.5 19.46 7.37 20.98L5.95 26.16L11.25 24.77C12.71 25.57 14.35 25.99 16.01 25.99H16.02C21.52 25.99 26 21.51 26 16.01C26 13.35 24.96 10.81 23.07 8.92ZM16.02 24.31H16.01C14.53 24.31 13.07 23.91 11.8 23.16L11.5 22.98L8.35 23.81L9.19 20.74L9 20.43C8.17 19.11 7.73 17.56 7.73 15.98C7.73 11.41 11.45 7.69 16.03 7.69C18.24 7.69 20.32 8.55 21.88 10.12C23.45 11.68 24.31 13.77 24.31 15.99C24.31 20.56 20.59 24.31 16.02 24.31ZM20.57 18.11C20.32 17.98 19.1 17.38 18.87 17.3C18.64 17.21 18.48 17.17 18.31 17.42C18.14 17.67 17.67 18.23 17.52 18.4C17.38 18.56 17.23 18.58 16.98 18.46C16.73 18.33 15.93 18.07 14.98 17.22C14.24 16.56 13.74 15.75 13.6 15.5C13.45 15.25 13.58 15.11 13.71 14.99C13.82 14.88 13.96 14.7 14.08 14.56C14.21 14.41 14.25 14.31 14.33 14.14C14.42 13.97 14.38 13.83 14.31 13.7C14.25 13.58 13.75 12.35 13.54 11.85C13.34 11.37 13.13 11.43 12.98 11.42C12.83 11.41 12.67 11.41 12.5 11.41C12.33 11.41 12.06 11.47 11.83 11.72C11.6 11.97 10.96 12.57 10.96 13.8C10.96 15.03 11.85 16.22 11.98 16.39C12.1 16.55 13.74 19.08 16.25 20.16C16.85 20.42 17.31 20.57 17.67 20.69C18.27 20.88 18.82 20.85 19.25 20.79C19.73 20.72 20.74 20.18 20.95 19.59C21.16 19.01 21.16 18.51 21.09 18.4C21.03 18.3 20.82 18.23 20.57 18.11Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const FloatingSocialButtons: React.FC<FloatingSocialButtonsProps> = ({
  onOpenBooking,
}) => {
  const { siteSettings } = useData();

  const rawNumber = siteSettings.whatsappNumber || '';
  const cleanNumber = rawNumber.replace(/\D/g, '');
  const igUsername = (siteSettings.instagramHandle || '@pamelaboccaletti').replace(/^@/, '').trim();
  const instagramUrl = `https://www.instagram.com/${igUsername}/`;
  const whatsappUrl = cleanNumber
    ? `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(
        'Olá, Pâmela! Vim pelo site e gostaria de informações sobre imóveis em Alphaville.'
      )}`
    : '';

  return (
    <aside
      aria-label="Redes sociais oficiais e WhatsApp"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-3"
    >
      {/* Instagram Official Floating Button */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram oficial ${siteSettings.instagramHandle || '@pamelaboccaletti'}`}
        title={`Instagram ${siteSettings.instagramHandle || '@pamelaboccaletti'}`}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#FAF7F2] overflow-hidden"
      >
        <span className="pointer-events-none hidden sm:block absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#2D3B32] text-[#FAF7F2] text-xs font-medium px-3 py-1.5 shadow-md opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-[#4D6254]">
          Instagram {siteSettings.instagramHandle || '@pamelaboccaletti'}
        </span>
        <OfficialInstagramIcon className="w-full h-full" />
      </a>

      {/* WhatsApp Official Floating Button */}
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar no WhatsApp oficial"
          title="Conversar no WhatsApp"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#FAF7F2]"
        >
          <span className="pointer-events-none hidden sm:block absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#2D3B32] text-[#FAF7F2] text-xs font-medium px-3 py-1.5 shadow-md opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-[#4D6254]">
            WhatsApp Direto
          </span>
          <OfficialWhatsAppIcon className="w-full h-full" />
        </a>
      ) : (
        <button
          type="button"
          onClick={onOpenBooking}
          aria-label="Atendimento via WhatsApp e Agendamento"
          title="Falar pelo WhatsApp / Agendar"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-[#FAF7F2] cursor-pointer"
        >
          <span className="pointer-events-none hidden sm:block absolute right-full mr-3 whitespace-nowrap rounded-full bg-[#2D3B32] text-[#FAF7F2] text-xs font-medium px-3 py-1.5 shadow-md opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 border border-[#4D6254]">
            WhatsApp / Agendar
          </span>
          <OfficialWhatsAppIcon className="w-full h-full" />
        </button>
      )}
    </aside>
  );
};
