import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Calendar, ArrowUpRight, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import claraPortrait from '../../assets/images/clara_assistant_portrait_1794600152422.jpg';
import { OfficialInstagramIcon, OfficialWhatsAppIcon } from './FloatingSocialButtons';

interface VirtualAssistantProps {
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

interface ChatActionLink {
  label: string;
  type: 'instagram' | 'whatsapp' | 'facebook' | 'booking' | 'scroll';
  target?: string;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  actions?: ChatActionLink[];
}

const QUICK_TOPICS = [
  'Imóveis à venda',
  'Opções para alugar',
  'Alpha Vita & Tamboré',
  'Redes sociais da Pâmela',
  'Agendar visita',
];

const formatCurrencyBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  const { properties, siteSettings } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rawNumber = siteSettings.whatsappNumber || '';
  const cleanNumber = rawNumber.replace(/\D/g, '');
  const igUsername = (siteSettings.instagramHandle || '@pamelaboccaletti').replace(/^@/, '').trim();
  const instagramUrl = `https://www.instagram.com/${igUsername}/`;
  const facebookUrl = 'https://www.facebook.com';
  const whatsappUrl = cleanNumber
    ? `https://wa.me/55${cleanNumber}?text=${encodeURIComponent(
        'Olá, Pâmela! Conversando com a Clara no site, gostaria de continuar o atendimento por aqui.'
      )}`
    : '';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Olá! Eu sou a Clara, assistente virtual da corretora ${siteSettings.professionalName}. Como posso ajudar você hoje a encontrar seu imóvel em Alphaville? Posso responder dúvidas rápidas ou conectar você diretamente às redes sociais da Pâmela.`,
      actions: [
        { label: 'Instagram', type: 'instagram' },
        { label: cleanNumber ? 'WhatsApp Direto' : 'Falar com Pâmela', type: 'whatsapp' },
        { label: 'Agendar Visita', type: 'booking' },
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const generateReply = (rawQuery: string): Omit<ChatMessage, 'id' | 'sender'> => {
    const q = rawQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const published = properties.filter((p) => p.status === 'published');
    const forSale = published.filter((p) => p.transactionType === 'sale');
    const forRent = published.filter((p) => p.transactionType === 'rent');

    if (/(redes|social|sociais|insta|instagram|facebook|face|seguir|perfil|contato|falar|whatsapp|whats|telefone)/.test(q)) {
      return {
        text: `Você pode acompanhar lançamentos, bastidores e novidades da ${siteSettings.professionalName} diretamente no Instagram (@${igUsername}), no Facebook (${siteSettings.facebookName}) ou iniciar uma conversa imediata no WhatsApp:`,
        actions: [
          { label: `Instagram @${igUsername}`, type: 'instagram' },
          { label: cleanNumber ? 'Abrir WhatsApp' : 'Enviar Mensagem / WhatsApp', type: 'whatsapp' },
          { label: 'Facebook Oficial', type: 'facebook' },
        ],
      };
    }

    if (/(venda|comprar|compra|valor|preco|investir|apartamento)/.test(q) && !/(alug|locac)/.test(q)) {
      const sample = forSale.slice(0, 2);
      const summary =
        sample.length > 0
          ? sample
              .map((p) => `• ${p.title} (${formatCurrencyBRL(p.price)})`)
              .join('\n')
          : 'Temos opções selecionadas em Alphaville.';
      return {
        text: `Temos ${forSale.length} ${forSale.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'} para compra em Alphaville no catálogo atual:\n${summary}\n\nQuer ver todos os detalhes ou conversar direto com a Pâmela pelo WhatsApp ou Instagram?`,
        actions: [
          { label: 'Ver Imóveis à Venda', type: 'scroll', target: 'comprar' },
          { label: cleanNumber ? 'WhatsApp Direto' : 'Falar com Pâmela', type: 'whatsapp' },
          { label: 'Instagram', type: 'instagram' },
        ],
      };
    }

    if (/(alug|locac|mobiliado|temporada|mensal)/.test(q)) {
      const sample = forRent.slice(0, 2);
      const summary =
        sample.length > 0
          ? sample
              .map((p) => `• ${p.title} (${formatCurrencyBRL(p.price)}/mês)`)
              .join('\n')
          : 'Consulte unidades disponíveis para locação.';
      return {
        text: `Para locação em Alphaville, temos ${forRent.length} ${forRent.length === 1 ? 'opção publicada' : 'opções publicadas'} no momento:\n${summary}\n\nVocê pode falar com a Pâmela no WhatsApp ou acompanhar os reels no Instagram!`,
        actions: [
          { label: 'Ver Opções de Locação', type: 'scroll', target: 'alugar' },
          { label: cleanNumber ? 'WhatsApp Direto' : 'Consultar Locação', type: 'whatsapp' },
          { label: 'Instagram', type: 'instagram' },
        ],
      };
    }

    if (/(alpha vita|tambore|jardins|condominio|bairro|regiao|alphaville|endereco|localizacao)/.test(q)) {
      return {
        text: 'A Pâmela atua com foco nos principais condomínios de Alphaville (Barueri e Santana de Parnaíba), como Alpha Vita e Jardins de Tamboré. Por privacidade e segurança dos proprietários, os endereços completos são informados na confirmação da visita. Quer conhecer o guia ou falar pelas redes?',
        actions: [
          { label: 'Guia Alphaville', type: 'scroll', target: 'alphaville' },
          { label: 'Instagram @' + igUsername, type: 'instagram' },
          { label: 'Agendar Visita', type: 'booking' },
        ],
      };
    }

    if (/(visita|agendar|horario|conhecer|marcar)/.test(q)) {
      return {
        text: 'Agendar uma visita privativa é simples e rápido! Você pode escolher o dia e horário aqui pelo formulário do site ou chamar a Pâmela direto pelo WhatsApp e Instagram:',
        actions: [
          { label: 'Abrir Agendamento', type: 'booking' },
          { label: cleanNumber ? 'WhatsApp Direto' : 'Enviar Contato', type: 'whatsapp' },
          { label: 'Instagram', type: 'instagram' },
        ],
      };
    }

    if (/(quem|pamela|sobre|corretora|creci|experiencia)/.test(q)) {
      return {
        text: `${siteSettings.professionalName} é especialista em imóveis selecionados em Alphaville/SP, oferecendo atendimento discreto, consultivo e personalizado da seleção do imóvel até o fechamento. Acompanhe o dia a dia dela nas redes sociais:`,
        actions: [
          { label: 'Sobre a Pâmela', type: 'scroll', target: 'sobre' },
          { label: 'Instagram', type: 'instagram' },
          { label: 'Facebook', type: 'facebook' },
        ],
      };
    }

    if (/(oi|ola|bom dia|boa tarde|boa noite|tudo bem|ajuda)/.test(q)) {
      return {
        text: `Olá! Que bom ter você por aqui. Estou pronta para ajudar com informações sobre venda, locação em Alphaville, condomínios como Alpha Vita e Jardins de Tamboré, ou para levar você até o Instagram e WhatsApp da ${siteSettings.professionalName}. O que você procura hoje?`,
        actions: [
          { label: 'Ver Imóveis', type: 'scroll', target: 'destaques' },
          { label: 'Instagram', type: 'instagram' },
          { label: cleanNumber ? 'WhatsApp' : 'Agendar Contato', type: 'whatsapp' },
        ],
      };
    }

    return {
      text: `Entendi! Para uma resposta sob medida sobre essa dúvida ou negociação, a ${siteSettings.professionalName} atende pessoalmente pelo WhatsApp e pelas redes sociais oficiais. Escolha por onde prefere continuar:`,
      actions: [
        { label: `Instagram @${igUsername}`, type: 'instagram' },
        { label: cleanNumber ? 'Conversar no WhatsApp' : 'Solicitar Atendimento', type: 'whatsapp' },
        { label: 'Facebook', type: 'facebook' },
      ],
    };
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = generateReply(trimmed);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        ...reply,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 350);
  };

  const handleActionClick = (action: ChatActionLink) => {
    if (action.type === 'instagram') {
      window.open(instagramUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (action.type === 'facebook') {
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (action.type === 'whatsapp') {
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        onOpenBooking();
      }
      return;
    }
    if (action.type === 'booking') {
      onOpenBooking();
      return;
    }
    if (action.type === 'scroll' && action.target) {
      onNavigate(action.target);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const renderAvatar = (sizeClass: string) => {
    if (avatarError) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-[#B55D3E] text-[#FAF7F2] flex items-center justify-center font-serif font-semibold text-base shrink-0 border-2 border-[#E29578]`}
        >
          C
        </div>
      );
    }
    return (
      <img
        src={claraPortrait}
        alt="Clara - Assistente Virtual"
        onError={() => setAvatarError(true)}
        className={`${sizeClass} rounded-full object-cover object-top shrink-0 border-2 border-[#E29578]`}
      />
    );
  };

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="clara-launcher"
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(true)}
            aria-label="Abrir assistente virtual Clara"
            className="group flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] border border-[#4D6254] rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer max-w-[calc(100vw-6.25rem)]"
          >
            {renderAvatar('w-10 h-10 sm:w-11 sm:h-11')}
            <div className="text-left leading-tight min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-sm sm:text-base font-medium text-[#FAF7F2] truncate">
                  Clara
                </span>
                <Sparkles className="w-3 h-3 text-[#E29578] shrink-0" />
              </div>
              <p className="text-[11px] text-[#C6D4C8] truncate">
                Assistente Virtual · Dúvidas &amp; Redes
              </p>
            </div>
            <span className="ml-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-[#B55D3E] group-hover:bg-[#9B4D32] text-[#FAF7F2] transition-colors shrink-0">
              <MessageCircle className="w-4 h-4" />
            </span>
          </motion.button>
        ) : (
          <motion.section
            key="clara-window"
            aria-label="Chat com Clara, Assistente Virtual"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="w-[345px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-5rem)] flex flex-col bg-[#FAF7F2] border border-[#E3DACF] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Assistant Header */}
            <div className="bg-[#2D3B32] text-[#FAF7F2] px-4 py-3.5 flex items-center justify-between gap-3 border-b border-[#4D6254]">
              <div className="flex items-center gap-3 min-w-0">
                {renderAvatar('w-11 h-11')}
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-medium text-[#FAF7F2] leading-tight truncate">
                    Clara · Assistente Virtual
                  </h3>
                  <p className="text-[11px] text-[#C6D4C8] truncate mt-0.5">
                    Atendimento {siteSettings.professionalName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar assistente virtual"
                className="p-2 rounded-full text-[#C6D4C8] hover:text-[#FAF7F2] hover:bg-[#3B4D41] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Social Bar */}
            <div className="bg-[#F3EDE4] border-b border-[#E3DACF] px-3 py-2 flex items-center justify-between gap-1.5 overflow-x-auto">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#586E5E] shrink-0 mr-1">
                Redes:
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E3DACF] hover:border-[#B55D3E] text-[11px] font-medium text-[#2D3B32] transition-colors shrink-0"
                >
                  <OfficialInstagramIcon className="w-3.5 h-3.5 rounded" />
                  <span>Instagram</span>
                </a>
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E3DACF] hover:border-[#586E5E] text-[11px] font-medium text-[#2D3B32] transition-colors shrink-0"
                  >
                    <OfficialWhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E3DACF] hover:border-[#586E5E] text-[11px] font-medium text-[#2D3B32] transition-colors shrink-0 cursor-pointer"
                  >
                    <OfficialWhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                )}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E3DACF] hover:border-[#586E5E] text-[11px] font-medium text-[#2D3B32] transition-colors shrink-0"
                >
                  <Share2 className="w-3 h-3 text-[#586E5E]" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF7F2]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#586E5E] text-[#FAF7F2] rounded-br-sm'
                        : 'bg-white border border-[#E3DACF] text-[#2D3B32] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === 'assistant' && msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[92%]">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={`${msg.id}-act-${idx}`}
                          type="button"
                          onClick={() => handleActionClick(action)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                            action.type === 'whatsapp' || action.type === 'instagram'
                              ? 'bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2]'
                              : 'bg-[#E6ECE6] hover:bg-[#C6D4C8] text-[#2D3B32]'
                          }`}
                        >
                          {action.type === 'booking' && <Calendar className="w-3 h-3" />}
                          <span>{action.label}</span>
                          {(action.type === 'instagram' ||
                            action.type === 'facebook' ||
                            action.type === 'whatsapp') && <ArrowUpRight className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-[#E3DACF] text-[#586E5E] rounded-2xl rounded-bl-sm px-3.5 py-2 text-xs italic">
                    Clara está digitando...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Chips */}
            <div className="px-3 pt-2 pb-1.5 bg-[#FAF7F2] border-t border-[#E3DACF]/70 flex flex-wrap gap-1.5">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => sendMessage(topic)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F3EDE4] hover:bg-[#E6ECE6] text-[#2D3B32] border border-[#E3DACF] transition-colors cursor-pointer"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-[#F3EDE4] border-t border-[#E3DACF] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Pergunte sobre imóveis ou redes sociais..."
                aria-label="Digite sua pergunta para a Clara"
                className="flex-1 bg-white border border-[#E3DACF] focus:border-[#586E5E] rounded-full px-3.5 py-2 text-xs text-[#2D3B32] placeholder:text-[#586E5E]/70 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Enviar mensagem"
                className="w-9 h-9 rounded-full bg-[#B55D3E] hover:bg-[#9B4D32] disabled:opacity-50 text-[#FAF7F2] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
