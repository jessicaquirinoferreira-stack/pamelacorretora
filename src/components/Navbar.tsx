import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Lock, Instagram, Facebook } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenBooking: (propertyId?: string, propertyTitle?: string) => void;
  onOpenAdmin: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenAdmin,
  activeSection,
  onNavigate,
}) => {
  const { siteSettings } = useData();
  const { user, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'comprar', label: 'Comprar' },
    { id: 'alugar', label: 'Alugar' },
    { id: 'destaques', label: 'Destaques' },
    { id: 'sobre', label: 'Sobre Pâmela' },
    { id: 'alphaville', label: 'Alphaville' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#192b20]/95 backdrop-blur-md text-[#fbf9f5] shadow-lg py-3'
            : 'bg-gradient-to-b from-[#192b20]/90 to-transparent text-[#fbf9f5] py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Official Brand Logo shifted left */}
            <div
              onClick={() => handleNavClick('inicio')}
              className="cursor-pointer group focus:outline-none flex items-center py-1 -ml-5 sm:-ml-8 md:-ml-10"
              role="button"
              tabIndex={0}
              aria-label="Pâmela Boccaletti - Página Inicial"
            >
              <img
                src={
                  siteSettings.logoUrl ||
                  'https://i.postimg.cc/bNDNFx92/Logo-Imobiliario-Dourado-Pamela-Boccaletti.png'
                }
                alt={siteSettings.professionalName || 'Pâmela Boccaletti'}
                className="h-14 sm:h-18 md:h-22 w-auto max-w-[280px] sm:max-w-[360px] object-contain transition-all duration-300 group-hover:opacity-95"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm tracking-wider uppercase transition-colors relative py-1 ${
                    activeSection === item.id
                      ? 'text-[#c5a880] font-medium'
                      : 'text-[#fbf9f5]/80 hover:text-[#fbf9f5]'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a880]" />
                  )}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <a
                href="https://www.instagram.com/pamelaboccaletti/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @pamelaboccaletti"
                className="p-2 text-[#fbf9f5]/70 hover:text-[#c5a880] transition-colors"
                aria-label="Instagram de Pâmela Boccaletti"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Pamela Boccaletti"
                className="p-2 text-[#fbf9f5]/70 hover:text-[#c5a880] transition-colors"
                aria-label="Facebook de Pamela Boccaletti"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <button
                onClick={() => onOpenBooking()}
                className="inline-flex items-center gap-2 bg-[#c5a880] hover:bg-[#b8976b] text-[#192b20] px-5 py-2.5 rounded-full text-xs tracking-wider uppercase font-semibold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                Agendar Visita
              </button>

              {/* Discreet Admin Link */}
              <button
                onClick={onOpenAdmin}
                title={user ? (isAdmin ? 'Painel Admin' : 'Conta Conectada') : 'Acesso Restrito'}
                className="p-2 text-[#fbf9f5]/50 hover:text-[#c5a880] transition-colors"
                aria-label="Acesso ao Painel Administrativo"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                onClick={() => onOpenBooking()}
                className="bg-[#c5a880] text-[#192b20] px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider"
              >
                Visita
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#fbf9f5] hover:text-[#c5a880] transition-colors"
                aria-label="Menu Principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#192b20] border-t border-[#3b5242] px-4 pt-3 pb-6 space-y-3 mt-3 shadow-xl">
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left py-2 px-3 text-sm tracking-wider uppercase rounded-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#243d2e] text-[#c5a880] font-medium'
                      : 'text-[#fbf9f5]/80 hover:bg-[#243d2e] hover:text-[#fbf9f5]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-[#243d2e] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.instagram.com/pamelaboccaletti/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c5a880] p-1.5 text-xs flex items-center gap-1.5"
                >
                  <Instagram className="w-4 h-4" />
                  @pamelaboccaletti
                </a>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-[#fbf9f5]/60 flex items-center gap-1.5 hover:text-[#c5a880]"
              >
                <Lock className="w-3.5 h-3.5" />
                Painel Admin
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
