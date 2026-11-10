import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Clock, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Property } from '../types';

interface VisitBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProperty?: { id: string; title: string } | null;
}

export const VisitBookingModal: React.FC<VisitBookingModalProps> = ({
  isOpen,
  onClose,
  preselectedProperty,
}) => {
  const { properties, siteSettings, submitLead } = useData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState(preselectedProperty?.id || '');
  const [suggestedDate, setSuggestedDate] = useState('');
  const [preferredContactTime, setPreferredContactTime] = useState('Tarde (14h às 18h)');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const currentPropertyTitle =
    preselectedProperty?.title ||
    properties.find((p) => p.id === selectedPropertyId)?.title ||
    'Imóvel em Alphaville';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Por favor, informe seu nome.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Por favor, informe seu telefone ou WhatsApp para contato.');
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email,
        propertyId: selectedPropertyId,
        propertyTitle: currentPropertyTitle,
        suggestedDate,
        preferredContactTime,
        message,
        sourceUrl: window.location.href,
        utmSource: new URLSearchParams(window.location.search).get('utm_source') || 'direct',
        utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || 'web',
        utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || 'site',
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err);
      setErrorMsg('Ocorreu uma falha temporária ao registrar sua solicitação. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    const rawNumber = siteSettings.whatsappNumber || '';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const defaultText = encodeURIComponent(
      `Olá, Pâmela! Acabei de enviar uma solicitação de visita no seu site para o imóvel "${currentPropertyTitle}". Gostaria de confirmar disponibilidade.`
    );

    if (cleanNumber) {
      window.open(`https://wa.me/55${cleanNumber}?text=${defaultText}`, '_blank');
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setSuggestedDate('');
    setSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#192b20]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#fbf9f5] w-full max-w-lg rounded-sm overflow-hidden shadow-2xl border border-[#e8e2d9] relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e8e2d9] flex items-center justify-between bg-[#fbf9f5]">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-[#819885] font-semibold block">
              Atendimento Exclusivo
            </span>
            <h2 className="font-serif text-2xl text-[#192b20] font-medium leading-tight">
              Solicitar Agendamento de Visita
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-[#192b20]/60 hover:text-[#192b20] rounded-sm transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-2xl text-[#192b20] font-medium">
                Solicitação Recebida com Sucesso!
              </h3>

              <p className="text-sm text-[#192b20]/80 max-w-md mx-auto leading-relaxed">
                Obrigado, <strong className="text-[#192b20]">{name}</strong>. Pâmela Boccaletti
                recebeu sua solicitação para o imóvel <em>"{currentPropertyTitle}"</em> e entrará em
                contato em breve para confirmar o melhor horário.
              </p>

              <div className="text-xs text-[#192b20]/60 p-3 bg-[#f0ebe1] rounded-sm">
                * Lembramos que esta é uma solicitação preliminar sujeita à confirmação de agenda da
                corretora e autorização de acesso ao condomínio.
              </div>

              {siteSettings.whatsappNumber && (
                <div className="pt-3">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full bg-[#c5a880] hover:bg-[#b8976b] text-[#192b20] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-sm transition-all shadow"
                  >
                    Falar agora pelo WhatsApp
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs uppercase tracking-wider text-[#192b20]/70 hover:text-[#192b20] underline"
                >
                  Concluir e Voltar ao Site
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm">
                  {errorMsg}
                </div>
              )}

              {/* Selected Property preview */}
              {currentPropertyTitle && (
                <div className="p-3 bg-[#f0ebe1] border border-[#e8e2d9] rounded-sm text-xs">
                  <span className="text-[#819885] font-semibold uppercase tracking-wider block text-[10px]">
                    Imóvel de Interesse:
                  </span>
                  <span className="font-medium text-[#192b20] line-clamp-1">
                    {currentPropertyTitle}
                  </span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#819885] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana Silva"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                  Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#819885] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                  E-mail (opcional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#819885] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                  />
                </div>
              </div>

              {/* Suggested Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                    Data Sugerida
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#819885] absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={suggestedDate}
                      onChange={(e) => setSuggestedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                    Melhor Horário
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#819885] absolute left-3 top-2.5" />
                    <select
                      value={preferredContactTime}
                      onChange={(e) => setPreferredContactTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                    >
                      <option value="Manhã (09h às 12h)">Manhã (09h às 12h)</option>
                      <option value="Tarde (14h às 18h)">Tarde (14h às 18h)</option>
                      <option value="Sábado de manhã">Sábado de manhã</option>
                      <option value="Qualquer horário">Qualquer horário</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#192b20]/80 font-medium mb-1">
                  Mensagem ou observações
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gostaria de conhecer o imóvel e saber detalhes sobre visitação..."
                    className="w-full p-2.5 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#192b20]/60 leading-tight">
                Seus dados serão tratados com sigilo profissional para fins exclusivos de atendimento
                imobiliário em Alphaville.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-sm transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4 text-[#c5a880]" />
                  {submitting ? 'Registrando Solicitação...' : 'Confirmar Solicitação de Visita'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
