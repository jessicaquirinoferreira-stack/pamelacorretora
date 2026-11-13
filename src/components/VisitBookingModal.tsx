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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#2D3B32]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-[#E3DACF] relative">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E3DACF] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-[#586E5E] font-semibold block">
              Atendimento Exclusivo
            </span>
            <h2 className="font-serif text-2xl text-[#2D3B32] font-medium leading-tight">
              Solicitar Agendamento de Visita
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-[#2D3B32]/70 hover:text-[#2D3B32] hover:bg-[#F3EDE4] rounded-full transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#E6ECE6] text-[#2D3B32] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#586E5E]" />
              </div>

              <h3 className="font-serif text-2xl text-[#2D3B32] font-medium">
                Solicitação Recebida com Sucesso!
              </h3>

              <p className="text-sm text-[#2D3B32]/85 max-w-md mx-auto leading-relaxed">
                Obrigado, <strong className="text-[#2D3B32]">{name}</strong>. Pâmela Boccaletti
                recebeu sua solicitação para o imóvel <em>"{currentPropertyTitle}"</em> e entrará em
                contato em breve para confirmar o melhor horário.
              </p>

              <div className="text-xs text-[#2D3B32]/80 p-3 bg-[#F3EDE4] border border-[#E3DACF] rounded-lg">
                * Lembramos que esta é uma solicitação preliminar sujeita à confirmação de agenda da
                corretora e autorização de acesso ao condomínio.
              </div>

              {siteSettings.whatsappNumber && (
                <div className="pt-3">
                  <button
                    onClick={handleWhatsAppDirect}
                    className="w-full bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-full transition-all shadow cursor-pointer"
                  >
                    Falar agora pelo WhatsApp
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="text-xs uppercase tracking-wider text-[#2D3B32]/80 hover:text-[#2D3B32] underline cursor-pointer"
                >
                  Concluir e Voltar ao Site
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-[#F9EBE5] border border-[#B55D3E]/50 text-[#9B4D32] text-xs rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Selected Property preview */}
              {currentPropertyTitle && (
                <div className="p-3 bg-[#F3EDE4] border border-[#E3DACF] rounded-lg text-xs">
                  <span className="text-[#586E5E] font-semibold uppercase tracking-wider block text-[10px]">
                    Imóvel de Interesse:
                  </span>
                  <span className="font-medium text-[#2D3B32] line-clamp-1">
                    {currentPropertyTitle}
                  </span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                  Seu Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#586E5E] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ana Silva"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                  Telefone / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#586E5E] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                  E-mail (opcional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#586E5E] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                </div>
              </div>

              {/* Suggested Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                    Data Sugerida
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#586E5E] absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={suggestedDate}
                      onChange={(e) => setSuggestedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                    Melhor Horário
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#586E5E] absolute left-3 top-2.5" />
                    <select
                      value={preferredContactTime}
                      onChange={(e) => setPreferredContactTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
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
                <label className="block text-xs uppercase tracking-wider text-[#2D3B32]/85 font-semibold mb-1">
                  Mensagem ou observações
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gostaria de conhecer o imóvel e saber detalhes sobre visitação..."
                    className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                  />
                </div>
              </div>

              <div className="text-[11px] text-[#2D3B32]/75 leading-tight">
                Seus dados serão tratados com sigilo profissional para fins exclusivos de atendimento
                imobiliário em Alphaville.
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-full transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#E29578]" />
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
