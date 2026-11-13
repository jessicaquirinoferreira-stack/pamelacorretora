import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Property, Lead, SiteSettings, LandingPage } from '../../types';
import { MediaUploadDropzone } from './MediaUploadDropzone';
import { getBlobStorageStatus, deleteMediaFromBlob } from '../../utils/blobStorage';
import {
  X,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Database,
  Users,
  Home,
  Settings,
  Phone,
  LogOut,
  LogIn,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  Film,
  Image as ImageIcon,
  Star,
  LayoutTemplate,
  Search,
  Globe,
  Share2,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewLandingPage?: (landingPage: LandingPage) => void;
}

type AdminTab = 'metrics' | 'properties' | 'landing-pages' | 'leads' | 'settings';

function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onPreviewLandingPage,
}) => {
  const { user, isAdmin, login, logout } = useAuth();
  const {
    properties,
    siteSettings,
    landingPages,
    leads,
    saveProperty,
    deleteProperty,
    saveLandingPage,
    deleteLandingPage,
    saveSiteSettings,
    updateLeadStatus,
    deleteLead,
    seedInitialDataToFirestore,
  } = useData();

  const [activeTab, setActiveTab] = useState<AdminTab>('metrics');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingNewProperty, setIsCreatingNewProperty] = useState(false);
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState('');
  const [newVideoUrlInput, setNewVideoUrlInput] = useState('');
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const [editingLandingPage, setEditingLandingPage] = useState<LandingPage | null>(null);
  const [isCreatingNewLp, setIsCreatingNewLp] = useState(false);
  const [newLpFeatureInput, setNewLpFeatureInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [editingSettings, setEditingSettings] = useState<SiteSettings>(siteSettings);
  const [leadNotesDraft, setLeadNotesDraft] = useState<Record<string, string>>({});

  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@x.com');
  const [loginPassword, setLoginPassword] = useState('admin4321');
  const [loginError, setLoginError] = useState('');
  const [storageProvider, setStorageProvider] = useState<'vercel-blob' | 'local-storage'>('local-storage');

  useEffect(() => {
    setEditingSettings(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    if (!isOpen) return;
    getBlobStorageStatus(true).then((s) => setStorageProvider(s.provider));
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    window.setTimeout(() => setSaveSuccessNotice(''), 3500);
  };

  const getShareUrl = (slug: string) =>
    `${window.location.origin}/?lp=${encodeURIComponent(slug)}`;

  const handleCopyText = async (id: string, text: string, noticeMsg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      triggerNotice(noticeMsg);
      window.setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  const handleSeedData = async () => {
    setActionLoading(true);
    try {
      await seedInitialDataToFirestore();
      triggerNotice('Banco de dados Firestore sincronizado em tempo real!');
    } catch (err) {
      console.error(err);
      triggerNotice('Erro ao sincronizar dados no Firestore.');
    } finally {
      setActionLoading(false);
    }
  };

  // Start new property
  const startNewProperty = () => {
    const now = new Date().toISOString();
    setEditingProperty({
      id: `prop-${Date.now()}`,
      title: '',
      slug: '',
      code: `PB-${Math.floor(100 + Math.random() * 900)}`,
      transactionType: 'sale',
      propertyType: 'apartment',
      price: 0,
      condominiumName: 'Alpha Vita',
      region: 'Alphaville/SP',
      areaM2: 100,
      bedrooms: 3,
      suites: 2,
      bathrooms: 3,
      halfBaths: 1,
      parkingSpots: 2,
      storageUnit: false,
      furnished: false,
      gourmetBalcony: false,
      expandedLivingRoom: false,
      description: '',
      features: ['Atendimento exclusivo Pâmela Boccaletti'],
      coverImage: '',
      gallery: [],
      videos: [],
      status: 'published',
      featured: false,
      pendingConfirmation: false,
      order: properties.length + 1,
      createdAt: now,
      updatedAt: now,
    });
    setIsCreatingNewProperty(true);
    setActiveTab('properties');
  };

  // Quick-create Landing Page from a chosen Property
  const startLandingPageFromProperty = (prop: Property) => {
    const now = new Date().toISOString();
    const lpSlug = slugifyText(`${prop.condominiumName}-${prop.title}`).slice(0, 80) || `lp-${Date.now()}`;
    setEditingLandingPage({
      id: `lp-${Date.now()}`,
      slug: lpSlug,
      title: `${prop.title} | ${prop.condominiumName}`,
      headline: prop.title,
      subheadline:
        prop.description?.slice(0, 220) ||
        `Oportunidade exclusiva em ${prop.condominiumName}, ${prop.region}. Agende sua visita privativa.`,
      propertyId: prop.id,
      coverImage: prop.coverImage || prop.gallery?.[0] || '',
      gallery: prop.gallery || [],
      videoUrl: prop.videos?.[0] || '',
      ctaText: 'Solicitar Apresentação Privativa',
      badgeText: prop.transactionType === 'sale' ? 'Oportunidade Exclusiva · Venda' : 'Locação Selecionada',
      features: prop.features?.length
        ? prop.features.slice(0, 6)
        : [
            `${prop.condominiumName} · ${prop.region}`,
            'Atendimento exclusivo Pâmela Boccaletti',
          ],
      status: 'published',
      createdAt: now,
      updatedAt: now,
    });
    setIsCreatingNewLp(true);
    setActiveTab('landing-pages');
  };

  // Handle Property Save
  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setActionLoading(true);
    try {
      const normalizedCover =
        editingProperty.coverImage ||
        editingProperty.gallery?.[0] ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80';
      await saveProperty({
        ...editingProperty,
        coverImage: normalizedCover,
      });
      setEditingProperty(null);
      setIsCreatingNewProperty(false);
      triggerNotice('Empreendimento salvo permanentemente no Firestore e atualizado no site!');
    } catch (err) {
      console.error(err);
      triggerNotice('Erro ao salvar imóvel no Firestore.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePropertyStatus = async (prop: Property) => {
    const nextStatus = prop.status === 'published' ? 'draft' : 'published';
    try {
      await saveProperty({ ...prop, status: nextStatus });
      triggerNotice(
        nextStatus === 'published'
          ? `"${prop.title}" publicado em tempo real no site!`
          : `"${prop.title}" movido para rascunho.`
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProperty = async (prop: Property) => {
    if (!window.confirm(`Excluir permanentemente "${prop.title}" do banco de dados e do site?`)) return;
    setActionLoading(true);
    try {
      await deleteProperty(prop.id);
      triggerNotice('Empreendimento removido permanentemente do Firestore e do site!');
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Landing Page Save
  const handleSaveLandingPageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLandingPage) return;
    setActionLoading(true);
    try {
      const cleanSlug = slugifyText(editingLandingPage.slug || editingLandingPage.headline || `lp-${Date.now()}`);
      await saveLandingPage({
        ...editingLandingPage,
        slug: cleanSlug,
      });
      setEditingLandingPage(null);
      setIsCreatingNewLp(false);
      triggerNotice('Landing Page Premium salva no Firestore e pronta para divulgação!');
    } catch (err) {
      console.error(err);
      triggerNotice('Erro ao salvar Landing Page.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteLandingPage = async (lp: LandingPage) => {
    if (!window.confirm(`Remover a Landing Page "${lp.headline}"?`)) return;
    setActionLoading(true);
    try {
      await deleteLandingPage(lp.id);
      triggerNotice('Landing Page removida permanentemente!');
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await saveSiteSettings(editingSettings);
      triggerNotice('Configurações atualizadas em tempo real em todo o site!');
    } catch (err) {
      console.error(err);
      triggerNotice('Erro ao salvar configurações.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesQuery =
      !propertySearch.trim() ||
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.condominiumName.toLowerCase().includes(propertySearch.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(propertySearch.toLowerCase());
    const matchesStatus = propertyStatusFilter === 'all' || p.status === propertyStatusFilter;
    return matchesQuery && matchesStatus;
  });

  const totalPhotosCount = properties.reduce((acc, p) => acc + (p.gallery?.length || 0), 0);
  const totalVideosCount = properties.reduce((acc, p) => acc + (p.videos?.length || 0), 0);

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-[#FAF7F2] text-[#2D3B32] flex flex-col overflow-hidden">
      {/* Full-Screen Top Command Bar */}
      <header className="h-16 shrink-0 bg-[#2D3B32] text-[#FAF7F2] px-4 sm:px-6 border-b border-[#4D6254] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-serif text-xl sm:text-2xl font-medium tracking-wide truncate">
            Painel Administrativo
          </span>
          <span className="hidden sm:inline-flex text-[10px] uppercase tracking-wider bg-[#B55D3E] text-[#FAF7F2] px-2.5 py-0.5 font-bold rounded-full">
            {siteSettings.professionalName || 'Pâmela Boccaletti'}
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[#C6D4C8] bg-[#3B4D41] px-3 py-1 rounded-full">
            <Globe className="w-3 h-3 text-[#E29578]" />
            {storageProvider === 'vercel-blob' ? 'Vercel Blob Storage Ativo' : 'Storage Mídia Ativo'}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#3B4D41] hover:bg-[#495C4E] text-[#FAF7F2] text-xs px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E29578]" />
            Ver Site ao Vivo
          </button>

          {user && (
            <>
              <span className="text-xs text-[#C6D4C8] hidden lg:inline">{user.email}</span>
              <button
                type="button"
                onClick={logout}
                className="bg-[#3B4D41] hover:bg-[#B55D3E] text-[#FAF7F2] text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#C6D4C8] hover:text-[#FAF7F2] hover:bg-[#3B4D41] rounded-full transition-colors cursor-pointer"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Global Real-time Notice Toast */}
      {saveSuccessNotice && (
        <div className="bg-[#586E5E] text-[#FAF7F2] px-6 py-2.5 text-xs font-medium flex items-center gap-2 shrink-0 shadow-sm">
          <CheckCircle className="w-4 h-4 text-[#E29578]" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Unauthenticated Login Screen */}
      {!user ? (
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-4 bg-[#FAF7F2]">
          <div className="bg-white border border-[#E3DACF] rounded-2xl p-8 sm:p-10 text-center space-y-4 max-w-md w-full shadow-xl">
            <div className="w-12 h-12 bg-[#E6ECE6] rounded-full mx-auto flex items-center justify-center text-[#9B4D32]">
              <LogIn className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-3xl font-medium text-[#2D3B32]">Acesso Privado</h3>
            <p className="text-xs text-[#2D3B32]/85 leading-relaxed">
              Área administrativa para gerenciar empreendimentos, mídias no Vercel Blob, Landing Pages e leads em tempo real.
            </p>
            {loginError && (
              <div className="p-3 bg-[#F9EBE5] text-[#9B4D32] text-xs rounded-lg border border-[#B55D3E]/50">
                {loginError}
              </div>
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoginError('');
                try {
                  await login(loginEmail, loginPassword);
                } catch (err: any) {
                  setLoginError(err.message || 'Falha ao autenticar. Verifique e-mail e senha.');
                }
              }}
              className="space-y-3 text-left pt-2"
            >
              <div>
                <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">E-mail</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">Senha</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-3 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider py-3.5 px-4 rounded-full flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4 text-[#E29578]" />
                Entrar no Painel Completo
              </button>
            </form>
            <p className="text-[11px] text-[#586E5E] pt-1 font-mono">
              Login: admin@x.com | Senha: admin4321
            </p>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-[#E3DACF] rounded-2xl p-10 text-center space-y-4 max-w-md shadow-xl">
            <ShieldAlert className="w-12 h-12 text-[#B55D3E] mx-auto" />
            <h3 className="font-serif text-2xl font-medium text-[#2D3B32]">Conta Não Autorizada</h3>
            <p className="text-xs text-[#2D3B32]/85 leading-relaxed">
              Você está conectado como <strong>{user.email}</strong>, sem permissão de administrador no Firestore.
            </p>
            <button
              type="button"
              onClick={logout}
              className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider py-2.5 px-6 rounded-full cursor-pointer"
            >
              Trocar de Conta
            </button>
          </div>
        </div>
      ) : (
        /* Full-Screen Robust Workspace: Sidebar + Fluid Content */
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0 bg-[#2D3B32] text-[#FAF7F2] border-b lg:border-b-0 lg:border-r border-[#4D6254] flex lg:flex-col p-2 sm:p-3 gap-1.5 overflow-x-auto">
            {[
              { id: 'metrics', label: 'Visão Geral', icon: Database },
              { id: 'properties', label: `Empreendimentos (${properties.length})`, icon: Home },
              { id: 'landing-pages', label: `Landing Pages (${landingPages.length})`, icon: LayoutTemplate },
              { id: 'leads', label: `Leads & Visitas (${leads.length})`, icon: Users },
              { id: 'settings', label: 'Configurações do Site', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as AdminTab);
                    if (item.id === 'settings') setEditingSettings(siteSettings);
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#B55D3E] text-[#FAF7F2] shadow-md'
                      : 'text-[#C6D4C8] hover:bg-[#3B4D41] hover:text-[#FAF7F2]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="hidden lg:block mt-auto pt-4 border-t border-[#4D6254] px-2 space-y-2">
              <div className="text-[10px] uppercase tracking-widest text-[#C6D4C8]/80 font-semibold">
                Sincronização Real
              </div>
              <p className="text-[11px] text-[#C6D4C8] leading-relaxed">
                Alterações refletem instantaneamente em todo o site e ficam salvas no Firestore.
              </p>
            </div>
          </aside>

          {/* Main Fluid Workspace */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF7F2]">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* TAB 1: VISÃO GERAL */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-3xl font-light text-[#2D3B32]">
                        Visão Geral do Portfólio
                      </h2>
                      <p className="text-xs text-[#586E5E] mt-1">
                        Controle completo em tempo real de imóveis, mídias comprimidas, landing pages e leads.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={startNewProperty}
                        className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Plus className="w-4 h-4 text-[#E29578]" />
                        Novo Empreendimento
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('landing-pages')}
                        className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Sparkles className="w-4 h-4" />
                        Criar Landing Page
                      </button>
                    </div>
                  </div>

                  {/* KPI Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 border border-[#E3DACF] rounded-2xl shadow-xs">
                      <span className="text-[11px] uppercase tracking-wider text-[#586E5E] font-semibold">
                        Empreendimentos Ativos
                      </span>
                      <div className="font-serif text-4xl font-medium mt-1 text-[#2D3B32]">
                        {properties.filter((p) => p.status === 'published').length}
                      </div>
                      <span className="text-xs text-[#586E5E]">de {properties.length} cadastrados</span>
                    </div>

                    <div className="bg-white p-5 border border-[#E3DACF] rounded-2xl shadow-xs">
                      <span className="text-[11px] uppercase tracking-wider text-[#586E5E] font-semibold">
                        Landing Pages Ativas
                      </span>
                      <div className="font-serif text-4xl font-medium mt-1 text-[#9B4D32]">
                        {landingPages.filter((lp) => lp.status === 'published').length}
                      </div>
                      <span className="text-xs text-[#586E5E]">prontas para redes sociais</span>
                    </div>

                    <div className="bg-white p-5 border border-[#E3DACF] rounded-2xl shadow-xs">
                      <span className="text-[11px] uppercase tracking-wider text-[#586E5E] font-semibold">
                        Mídias Armazenadas
                      </span>
                      <div className="font-serif text-4xl font-medium mt-1 text-[#2D3B32]">
                        {totalPhotosCount + totalVideosCount}
                      </div>
                      <span className="text-xs text-[#586E5E]">
                        {totalPhotosCount} fotos · {totalVideosCount} vídeos
                      </span>
                    </div>

                    <div className="bg-white p-5 border border-[#E3DACF] rounded-2xl shadow-xs">
                      <span className="text-[11px] uppercase tracking-wider text-[#586E5E] font-semibold">
                        Leads & Visitas
                      </span>
                      <div className="font-serif text-4xl font-medium mt-1 text-[#2D3B32]">
                        {leads.length}
                      </div>
                      <span className="text-xs text-[#586E5E]">solicitações recebidas</span>
                    </div>
                  </div>

                  {/* Firestore Sync Box */}
                  <div className="bg-[#F3EDE4] p-6 border border-[#E3DACF] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-[#2D3B32]">
                        Sincronização Direta com Firestore
                      </h3>
                      <p className="text-xs text-[#2D3B32]/85 mt-1 max-w-2xl">
                        Se desejar restaurar os imóveis de referência iniciais no banco de dados Firestore,
                        utilize o botão ao lado. Toda edição, adição ou exclusão normal já grava automaticamente em tempo real.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleSeedData}
                      disabled={actionLoading}
                      className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-full transition-colors whitespace-nowrap shadow inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Database className="w-4 h-4 text-[#E29578]" />
                      Restaurar Dados Iniciais
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: EMPREENDIMENTOS (CRUD + UNLIMITED PHOTOS/VIDEOS + COMPRESSION) */}
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  {!editingProperty ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-serif text-3xl font-light text-[#2D3B32]">
                            Gerenciar Empreendimentos
                          </h2>
                          <p className="text-xs text-[#586E5E] mt-1">
                            Adicione, edite ou exclua empreendimentos com fotos comprimidas e vídeos ilimitados.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={startNewProperty}
                          className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow self-start"
                        >
                          <Plus className="w-4 h-4 text-[#E29578]" />
                          Novo Empreendimento
                        </button>
                      </div>

                      {/* Search & Status Filters */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#586E5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={propertySearch}
                            onChange={(e) => setPropertySearch(e.target.value)}
                            placeholder="Buscar por título, condomínio ou código..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E3DACF] rounded-full text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>
                        <select
                          value={propertyStatusFilter}
                          onChange={(e) => setPropertyStatusFilter(e.target.value as any)}
                          className="bg-white border border-[#E3DACF] rounded-full px-4 py-2.5 text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                        >
                          <option value="all">Todos os status</option>
                          <option value="published">Publicados</option>
                          <option value="draft">Rascunhos</option>
                          <option value="archived">Arquivados</option>
                        </select>
                      </div>

                      {/* Properties Table / Cards */}
                      {filteredProperties.length === 0 ? (
                        <div className="bg-white border border-[#E3DACF] rounded-2xl p-12 text-center space-y-3">
                          <Home className="w-10 h-10 text-[#586E5E] mx-auto" />
                          <h3 className="font-serif text-xl text-[#2D3B32]">Nenhum empreendimento listado</h3>
                          <p className="text-xs text-[#586E5E]">
                            Clique em &ldquo;Novo Empreendimento&rdquo; para cadastrar e publicar imediatamente no site.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white border border-[#E3DACF] rounded-2xl overflow-x-auto shadow-xs">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#F3EDE4] text-[#2D3B32] uppercase font-semibold border-b border-[#E3DACF]">
                              <tr>
                                <th className="p-4">Empreendimento</th>
                                <th className="p-4">Condomínio</th>
                                <th className="p-4">Mídias</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E3DACF]">
                              {filteredProperties.map((prop) => (
                                <tr key={prop.id} className="hover:bg-[#FAF7F2]/80">
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={prop.coverImage || prop.gallery?.[0]}
                                        alt={prop.title}
                                        className="w-16 h-11 rounded-lg object-cover bg-[#2D3B32] shrink-0 border border-[#E3DACF]"
                                      />
                                      <div className="min-w-0">
                                        <div className="font-semibold text-[#2D3B32] line-clamp-1">
                                          {prop.title || 'Sem título'}
                                        </div>
                                        <div className="text-[11px] text-[#586E5E] font-mono">
                                          {prop.code || prop.id} ·{' '}
                                          {prop.transactionType === 'sale' ? 'Venda' : 'Locação'}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-[#2D3B32]">{prop.condominiumName}</td>
                                  <td className="p-4 text-[#586E5E]">
                                    <div className="flex items-center gap-2.5">
                                      <span className="inline-flex items-center gap-1">
                                        <ImageIcon className="w-3.5 h-3.5 text-[#9B4D32]" />
                                        {prop.gallery?.length || 0}
                                      </span>
                                      <span className="inline-flex items-center gap-1">
                                        <Film className="w-3.5 h-3.5 text-[#586E5E]" />
                                        {prop.videos?.length || 0}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-semibold text-[#2D3B32] whitespace-nowrap">
                                    R$ {prop.price.toLocaleString('pt-BR')}
                                  </td>
                                  <td className="p-4">
                                    <button
                                      type="button"
                                      onClick={() => handleTogglePropertyStatus(prop)}
                                      title="Clique para alternar entre Publicado e Rascunho"
                                      className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                                        prop.status === 'published'
                                          ? 'bg-[#E6ECE6] text-[#2D3B32] hover:bg-[#C6D4C8]'
                                          : 'bg-[#F9EBE5] text-[#9B4D32] hover:bg-[#E29578]/30'
                                      }`}
                                    >
                                      {prop.status === 'published' ? 'Publicado' : prop.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                                    </button>
                                  </td>
                                  <td className="p-4 text-right">
                                    <div className="inline-flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => startLandingPageFromProperty(prop)}
                                        className="px-3 py-1.5 rounded-full bg-[#F3EDE4] hover:bg-[#E6ECE6] text-[#2D3B32] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Criar Landing Page Premium deste empreendimento"
                                      >
                                        <Sparkles className="w-3.5 h-3.5 text-[#9B4D32]" />
                                        <span className="hidden xl:inline">Landing Page</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingProperty({
                                            ...prop,
                                            gallery: prop.gallery || [],
                                            videos: prop.videos || [],
                                            features: prop.features || [],
                                          });
                                          setIsCreatingNewProperty(false);
                                        }}
                                        className="p-2 text-[#586E5E] hover:text-[#2D3B32] hover:bg-[#F3EDE4] rounded-full cursor-pointer"
                                        title="Editar empreendimento"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProperty(prop)}
                                        className="p-2 text-[#B55D3E] hover:text-[#9B4D32] hover:bg-[#F9EBE5] rounded-full cursor-pointer"
                                        title="Excluir permanentemente"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Full Property Editor Form */
                    <form
                      onSubmit={handleSavePropertySubmit}
                      className="bg-white p-6 sm:p-8 border border-[#E3DACF] rounded-2xl space-y-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3DACF]">
                        <div>
                          <h3 className="font-serif text-2xl font-medium text-[#2D3B32]">
                            {isCreatingNewProperty ? 'Cadastrar Novo Empreendimento' : 'Editar Empreendimento'}
                          </h3>
                          <p className="text-xs text-[#586E5E]">
                            Salve para atualizar o site completo em tempo real e armazenar no Firestore.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-4 py-2 rounded-full border border-[#E3DACF] text-xs font-semibold text-[#2D3B32] hover:bg-[#F3EDE4] cursor-pointer"
                        >
                          Voltar à lista
                        </button>
                      </div>

                      {/* Basic Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2 lg:col-span-3">
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Título do Empreendimento *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProperty.title}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                title: e.target.value,
                                slug: slugifyText(e.target.value),
                              })
                            }
                            placeholder="Ex: Apartamento 3 Dormitórios no Jardins de Tamboré"
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Status de Exibição
                          </label>
                          <select
                            value={editingProperty.status}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                status: e.target.value as Property['status'],
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          >
                            <option value="published">Publicado no Site</option>
                            <option value="draft">Rascunho (Oculto)</option>
                            <option value="archived">Arquivado</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Condomínio *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProperty.condominiumName}
                            onChange={(e) =>
                              setEditingProperty({ ...editingProperty, condominiumName: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Região
                          </label>
                          <input
                            type="text"
                            value={editingProperty.region}
                            onChange={(e) => setEditingProperty({ ...editingProperty, region: e.target.value })}
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Tipo de Negócio *
                          </label>
                          <select
                            value={editingProperty.transactionType}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                transactionType: e.target.value as 'sale' | 'rent',
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          >
                            <option value="sale">Venda</option>
                            <option value="rent">Locação</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Preço (R$) *
                          </label>
                          <input
                            type="number"
                            required
                            value={editingProperty.price}
                            onChange={(e) =>
                              setEditingProperty({ ...editingProperty, price: Number(e.target.value) })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Código
                          </label>
                          <input
                            type="text"
                            value={editingProperty.code || ''}
                            onChange={(e) => setEditingProperty({ ...editingProperty, code: e.target.value })}
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Área (m²)
                          </label>
                          <input
                            type="number"
                            value={editingProperty.areaM2 ?? ''}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                areaM2: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Dormitórios
                          </label>
                          <input
                            type="number"
                            value={editingProperty.bedrooms ?? ''}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                bedrooms: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Suítes
                          </label>
                          <input
                            type="number"
                            value={editingProperty.suites ?? ''}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                suites: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Vagas
                          </label>
                          <input
                            type="number"
                            value={editingProperty.parkingSpots ?? ''}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                parkingSpots: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Categoria
                          </label>
                          <select
                            value={editingProperty.propertyType}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                propertyType: e.target.value as Property['propertyType'],
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          >
                            <option value="apartment">Apartamento</option>
                            <option value="house">Casa em Condomínio</option>
                            <option value="penthouse">Cobertura</option>
                            <option value="land">Terreno</option>
                            <option value="commercial">Comercial</option>
                          </select>
                        </div>
                      </div>

                      {/* Cover Image + Compression Upload */}
                      <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-serif text-lg font-medium text-[#2D3B32]">
                            Foto de Capa & Galeria Ilimitada (Vercel Blob + Compressão WebP)
                          </h4>
                          <span className="text-[11px] text-[#586E5E]">
                            {editingProperty.gallery.length} foto(s) na galeria
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                          <div className="lg:col-span-4 space-y-2">
                            <label className="block text-xs uppercase font-semibold text-[#2D3B32]/85">
                              Capa Atual
                            </label>
                            <div className="aspect-[16/10] bg-[#2D3B32] rounded-xl overflow-hidden border border-[#E3DACF]">
                              {editingProperty.coverImage ? (
                                <img
                                  src={editingProperty.coverImage}
                                  alt="Capa"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-[#C6D4C8]">
                                  Sem capa definida
                                </div>
                              )}
                            </div>
                            <input
                              type="url"
                              value={editingProperty.coverImage}
                              onChange={(e) =>
                                setEditingProperty({ ...editingProperty, coverImage: e.target.value })
                              }
                              placeholder="Ou cole a URL da foto de capa..."
                              className="w-full p-2 bg-white border border-[#E3DACF] rounded-lg text-[11px] text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                            />
                          </div>

                          <div className="lg:col-span-8 space-y-3">
                            <MediaUploadDropzone
                              mode="image"
                              folder="properties"
                              multiple
                              label="Subir Fotos Ilimitadas para Galeria (Compressão Automática)"
                              onUploaded={(urls) => {
                                setEditingProperty((prev) => {
                                  if (!prev) return prev;
                                  const merged = [...(prev.gallery || []), ...urls];
                                  return {
                                    ...prev,
                                    coverImage: prev.coverImage || urls[0],
                                    gallery: merged,
                                  };
                                });
                                triggerNotice(`${urls.length} foto(s) comprimida(s) e salva(s) no Storage!`);
                              }}
                            />

                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={newPhotoUrlInput}
                                onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                                placeholder="Ou cole URL externa de foto adicional..."
                                className="flex-1 p-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (!newPhotoUrlInput.trim()) return;
                                  setEditingProperty({
                                    ...editingProperty,
                                    coverImage: editingProperty.coverImage || newPhotoUrlInput.trim(),
                                    gallery: [...editingProperty.gallery, newPhotoUrlInput.trim()],
                                  });
                                  setNewPhotoUrlInput('');
                                }}
                                className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-4 py-2 text-xs rounded-full font-semibold cursor-pointer"
                              >
                                Adicionar URL
                              </button>
                            </div>
                          </div>
                        </div>

                        {editingProperty.gallery.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                            {editingProperty.gallery.map((imgUrl, gIdx) => {
                              const isCover = imgUrl === editingProperty.coverImage;
                              return (
                                <div
                                  key={`${imgUrl}-${gIdx}`}
                                  className={`relative group aspect-[16/10] bg-[#2D3B32] rounded-xl overflow-hidden border-2 ${
                                    isCover ? 'border-[#B55D3E]' : 'border-[#E3DACF]'
                                  }`}
                                >
                                  <img src={imgUrl} alt={`Foto ${gIdx + 1}`} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-[#2D3B32]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    {!isCover && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setEditingProperty({ ...editingProperty, coverImage: imgUrl })
                                        }
                                        className="bg-[#FAF7F2] text-[#2D3B32] px-2 py-1 rounded-full text-[10px] font-semibold cursor-pointer inline-flex items-center gap-1"
                                        title="Definir como capa"
                                      >
                                        <Star className="w-3 h-3 text-[#B55D3E]" />
                                        Capa
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deleteMediaFromBlob(imgUrl);
                                        const updated = editingProperty.gallery.filter((_, i) => i !== gIdx);
                                        setEditingProperty({
                                          ...editingProperty,
                                          gallery: updated,
                                          coverImage:
                                            isCover ? updated[0] || '' : editingProperty.coverImage,
                                        });
                                      }}
                                      className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] p-1.5 rounded-full cursor-pointer"
                                      title="Excluir foto"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  {isCover && (
                                    <span className="absolute bottom-1 left-1 bg-[#B55D3E] text-[#FAF7F2] text-[9px] uppercase font-bold px-2 py-0.5 rounded-full">
                                      Capa
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Unlimited Videos Upload */}
                      <div className="p-4 sm:p-5 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-serif text-lg font-medium text-[#2D3B32]">
                            Vídeos Ilimitados do Empreendimento (Vercel Blob)
                          </h4>
                          <span className="text-[11px] text-[#586E5E]">
                            {(editingProperty.videos || []).length} vídeo(s) anexado(s)
                          </span>
                        </div>

                        <MediaUploadDropzone
                          mode="video"
                          folder="videos"
                          multiple
                          label="Subir Vídeos Ilimitados (Tour, Reels, Apresentação)"
                          onUploaded={(urls) => {
                            setEditingProperty((prev) =>
                              prev ? { ...prev, videos: [...(prev.videos || []), ...urls] } : prev
                            );
                            triggerNotice(`${urls.length} vídeo(s) salvo(s) no Storage!`);
                          }}
                        />

                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={newVideoUrlInput}
                            onChange={(e) => setNewVideoUrlInput(e.target.value)}
                            placeholder="Ou cole a URL direta de um vídeo (MP4/WebM)..."
                            className="flex-1 p-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newVideoUrlInput.trim()) return;
                              setEditingProperty({
                                ...editingProperty,
                                videos: [...(editingProperty.videos || []), newVideoUrlInput.trim()],
                              });
                              setNewVideoUrlInput('');
                            }}
                            className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-4 py-2 text-xs rounded-full font-semibold cursor-pointer"
                          >
                            Adicionar URL Vídeo
                          </button>
                        </div>

                        {(editingProperty.videos || []).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {(editingProperty.videos || []).map((vidUrl, vIdx) => (
                              <div
                                key={`${vidUrl}-${vIdx}`}
                                className="relative bg-[#2D3B32] rounded-xl overflow-hidden border border-[#E3DACF]"
                              >
                                <video
                                  src={vidUrl}
                                  controls
                                  preload="metadata"
                                  className="w-full aspect-video object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteMediaFromBlob(vidUrl);
                                    setEditingProperty({
                                      ...editingProperty,
                                      videos: (editingProperty.videos || []).filter((_, i) => i !== vIdx),
                                    });
                                  }}
                                  className="absolute top-2 right-2 bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] p-1.5 rounded-full cursor-pointer shadow"
                                  title="Remover vídeo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Description & Features */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Descrição Completa
                          </label>
                          <textarea
                            rows={5}
                            value={editingProperty.description}
                            onChange={(e) =>
                              setEditingProperty({ ...editingProperty, description: e.target.value })
                            }
                            className="w-full p-3 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs uppercase font-semibold text-[#2D3B32]/85">
                            Diferenciais & Destaques
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newFeatureInput}
                              onChange={(e) => setNewFeatureInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (!newFeatureInput.trim()) return;
                                  setEditingProperty({
                                    ...editingProperty,
                                    features: [...editingProperty.features, newFeatureInput.trim()],
                                  });
                                  setNewFeatureInput('');
                                }
                              }}
                              placeholder="Ex: Piscina aquecida, vista livre..."
                              className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (!newFeatureInput.trim()) return;
                                setEditingProperty({
                                  ...editingProperty,
                                  features: [...editingProperty.features, newFeatureInput.trim()],
                                });
                                setNewFeatureInput('');
                              }}
                              className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-4 rounded-full text-xs font-semibold cursor-pointer"
                            >
                              Incluir
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {editingProperty.features.map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="inline-flex items-center gap-1.5 bg-[#E6ECE6] text-[#2D3B32] px-3 py-1 rounded-full text-xs"
                              >
                                <span>{feat}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingProperty({
                                      ...editingProperty,
                                      features: editingProperty.features.filter((_, i) => i !== fIdx),
                                    })
                                  }
                                  className="text-[#9B4D32] hover:text-[#2D3B32] cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Flags */}
                      <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#2D3B32]">
                        {[
                          { key: 'featured', label: 'Destaque Principal' },
                          { key: 'pendingConfirmation', label: 'Dados a Confirmar' },
                          { key: 'storageUnit', label: 'Depósito Privativo' },
                          { key: 'furnished', label: 'Totalmente Mobiliado' },
                          { key: 'gourmetBalcony', label: 'Varanda Gourmet' },
                          { key: 'expandedLivingRoom', label: 'Sala Ampliada' },
                        ].map((flag) => (
                          <label key={flag.key} className="inline-flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean((editingProperty as any)[flag.key])}
                              onChange={(e) =>
                                setEditingProperty({
                                  ...editingProperty,
                                  [flag.key]: e.target.checked,
                                })
                              }
                            />
                            <span>{flag.label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-[#E3DACF] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#2D3B32]/80 hover:bg-[#F3EDE4] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-7 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer shadow"
                        >
                          <Save className="w-4 h-4 text-[#E29578]" />
                          {actionLoading ? 'Salvando...' : 'Salvar no Firestore & Site'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: LANDING PAGES PREMIUM & LINKS PARA REDES SOCIAIS */}
              {activeTab === 'landing-pages' && (
                <div className="space-y-6">
                  {!editingLandingPage ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="font-serif text-3xl font-light text-[#2D3B32]">
                            Landing Pages Premium de Empreendimentos
                          </h2>
                          <p className="text-xs text-[#586E5E] mt-1">
                            Escolha qualquer empreendimento para gerar uma página de conversão exclusiva e copiar o link para Instagram, WhatsApp e campanhas.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const firstProp = properties[0];
                            if (firstProp) {
                              startLandingPageFromProperty(firstProp);
                            } else {
                              const now = new Date().toISOString();
                              setEditingLandingPage({
                                id: `lp-${Date.now()}`,
                                slug: `oportunidade-${Date.now()}`,
                                title: 'Apresentação Exclusiva Alphaville',
                                headline: 'Viva com Exclusividade em Alphaville',
                                subheadline: 'Agende uma apresentação privativa com Pâmela Boccaletti.',
                                propertyId: '',
                                coverImage: '',
                                gallery: [],
                                videoUrl: '',
                                ctaText: 'Solicitar Apresentação',
                                badgeText: 'Apresentação Exclusiva',
                                features: ['Atendimento personalizado Pâmela Boccaletti'],
                                status: 'published',
                                createdAt: now,
                                updatedAt: now,
                              });
                              setIsCreatingNewLp(true);
                            }
                          }}
                          className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow self-start"
                        >
                          <Plus className="w-4 h-4" />
                          Nova Landing Page
                        </button>
                      </div>

                      {landingPages.length === 0 ? (
                        <div className="bg-white border border-[#E3DACF] rounded-2xl p-12 text-center space-y-3">
                          <LayoutTemplate className="w-10 h-10 text-[#586E5E] mx-auto" />
                          <h3 className="font-serif text-xl text-[#2D3B32]">Nenhuma Landing Page criada</h3>
                          <p className="text-xs text-[#586E5E]">
                            Crie uma página dedicada para um empreendimento e gere o link imediato para divulgação nas redes sociais.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {landingPages.map((lp) => {
                            const linkedProp = properties.find((p) => p.id === lp.propertyId);
                            const shareUrl = getShareUrl(lp.slug);
                            const waPromoUrl = `https://wa.me/?text=${encodeURIComponent(
                              `✨ ${lp.headline}\n${lp.subheadline}\n\nConheça todos os detalhes e fotos exclusivas aqui:\n${shareUrl}`
                            )}`;
                            const igPromoText = `✨ ${lp.headline}\n${lp.subheadline}\n\n🔗 Acesse a página completa no link: ${shareUrl}\n📲 Atendimento exclusivo ${siteSettings.professionalName}`;

                            return (
                              <div
                                key={lp.id}
                                className="bg-white border border-[#E3DACF] rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                              >
                                <div className="flex flex-col sm:flex-row">
                                  <div className="sm:w-44 aspect-[16/10] sm:aspect-auto bg-[#2D3B32] shrink-0 relative">
                                    {lp.coverImage ? (
                                      <img
                                        src={lp.coverImage}
                                        alt={lp.headline}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : null}
                                    <span
                                      className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                        lp.status === 'published'
                                          ? 'bg-[#586E5E] text-[#FAF7F2]'
                                          : 'bg-[#F9EBE5] text-[#9B4D32]'
                                      }`}
                                    >
                                      {lp.status === 'published' ? 'Publicada' : 'Rascunho'}
                                    </span>
                                  </div>

                                  <div className="p-5 flex-1 space-y-2">
                                    <div className="text-[11px] uppercase tracking-wider text-[#9B4D32] font-semibold">
                                      {linkedProp ? `Imóvel: ${linkedProp.condominiumName}` : 'Campanha Personalizada'}
                                    </div>
                                    <h3 className="font-serif text-xl font-medium text-[#2D3B32] leading-snug">
                                      {lp.headline}
                                    </h3>
                                    <p className="text-xs text-[#2D3B32]/80 line-clamp-2">{lp.subheadline}</p>

                                    {/* Copyable Social Share URL Box */}
                                    <div className="pt-2">
                                      <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl px-3 py-2">
                                        <input
                                          type="text"
                                          readOnly
                                          value={shareUrl}
                                          className="flex-1 bg-transparent text-[11px] font-mono text-[#2D3B32] focus:outline-none truncate"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleCopyText(
                                              lp.id,
                                              shareUrl,
                                              'Link da Landing Page copiado para divulgar!'
                                            )
                                          }
                                          className="text-xs font-semibold text-[#9B4D32] hover:text-[#2D3B32] inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                        >
                                          {copiedId === lp.id ? (
                                            <>
                                              <Check className="w-3.5 h-3.5" /> Copiado
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3.5 h-3.5" /> Copiar Link
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Social Promotion & Actions Footer */}
                                <div className="px-5 py-3 bg-[#F3EDE4] border-t border-[#E3DACF] flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (onPreviewLandingPage) {
                                          onPreviewLandingPage(lp);
                                          onClose();
                                        } else {
                                          window.open(shareUrl, '_blank');
                                        }
                                      }}
                                      className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] px-3.5 py-1.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <ExternalLink className="w-3 h-3 text-[#E29578]" />
                                      Abrir Página
                                    </button>
                                    <a
                                      href={waPromoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-3.5 py-1.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1"
                                    >
                                      <Share2 className="w-3 h-3" />
                                      WhatsApp
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopyText(
                                          `ig-${lp.id}`,
                                          igPromoText,
                                          'Legenda + Link para Instagram copiados!'
                                        )
                                      }
                                      className="bg-white hover:bg-[#FAF7F2] border border-[#E3DACF] text-[#2D3B32] px-3 py-1.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3 text-[#9B4D32]" />
                                      {copiedId === `ig-${lp.id}` ? 'Copy Copiada!' : 'Copy Instagram'}
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingLandingPage({
                                          ...lp,
                                          gallery: lp.gallery || [],
                                          features: lp.features || [],
                                        });
                                        setIsCreatingNewLp(false);
                                      }}
                                      className="p-2 text-[#586E5E] hover:text-[#2D3B32] rounded-full cursor-pointer"
                                      title="Editar Landing Page"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLandingPage(lp)}
                                      className="p-2 text-[#B55D3E] hover:text-[#9B4D32] rounded-full cursor-pointer"
                                      title="Excluir Landing Page"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    /* Landing Page Premium Builder Form */
                    <form
                      onSubmit={handleSaveLandingPageSubmit}
                      className="bg-white p-6 sm:p-8 border border-[#E3DACF] rounded-2xl space-y-6 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E3DACF]">
                        <div>
                          <h3 className="font-serif text-2xl font-medium text-[#2D3B32]">
                            {isCreatingNewLp ? 'Criar Landing Page Premium' : 'Editar Landing Page Premium'}
                          </h3>
                          <p className="text-xs text-[#586E5E]">
                            Selecione o empreendimento e personalize a página exclusiva para gerar o link de divulgação.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingLandingPage(null)}
                          className="px-4 py-2 rounded-full border border-[#E3DACF] text-xs font-semibold text-[#2D3B32] hover:bg-[#F3EDE4] cursor-pointer"
                        >
                          Voltar
                        </button>
                      </div>

                      {/* Choose Empreendimento */}
                      <div className="p-4 bg-[#F3EDE4] border border-[#E3DACF] rounded-xl space-y-2">
                        <label className="block text-xs uppercase font-semibold text-[#2D3B32]">
                          1. Escolher Empreendimento Vinculado (Preenchimento Automático)
                        </label>
                        <select
                          value={editingLandingPage.propertyId}
                          onChange={(e) => {
                            const chosen = properties.find((p) => p.id === e.target.value);
                            if (chosen) {
                              setEditingLandingPage({
                                ...editingLandingPage,
                                propertyId: chosen.id,
                                title: `${chosen.title} | ${chosen.condominiumName}`,
                                headline: chosen.title,
                                subheadline: chosen.description?.slice(0, 220) || editingLandingPage.subheadline,
                                slug: slugifyText(`${chosen.condominiumName}-${chosen.title}`).slice(0, 80),
                                coverImage: chosen.coverImage || editingLandingPage.coverImage,
                                gallery: chosen.gallery || [],
                                videoUrl: chosen.videos?.[0] || editingLandingPage.videoUrl || '',
                                features: chosen.features?.length
                                  ? chosen.features.slice(0, 6)
                                  : editingLandingPage.features,
                              });
                            } else {
                              setEditingLandingPage({ ...editingLandingPage, propertyId: '' });
                            }
                          }}
                          className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                        >
                          <option value="">-- Selecione um empreendimento do catálogo --</option>
                          {properties.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({p.condominiumName} · R$ {p.price.toLocaleString('pt-BR')})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Título SEO / Aba *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingLandingPage.title}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, title: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Status da Página
                          </label>
                          <select
                            value={editingLandingPage.status}
                            onChange={(e) =>
                              setEditingLandingPage({
                                ...editingLandingPage,
                                status: e.target.value as 'published' | 'draft',
                              })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          >
                            <option value="published">Publicada (Link Ativo)</option>
                            <option value="draft">Rascunho</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Link Personalizado (Slug para Redes Sociais) *
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            <span className="text-xs font-mono text-[#586E5E] bg-[#F3EDE4] px-3 py-2.5 rounded-xl border border-[#E3DACF]">
                              {window.location.origin}/?lp=
                            </span>
                            <input
                              type="text"
                              required
                              value={editingLandingPage.slug}
                              onChange={(e) =>
                                setEditingLandingPage({
                                  ...editingLandingPage,
                                  slug: slugifyText(e.target.value),
                                })
                              }
                              className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs font-mono text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyText(
                                  'builder-slug',
                                  getShareUrl(editingLandingPage.slug),
                                  'Link de divulgação copiado!'
                                )
                              }
                              className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Copiar Link
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Selo Superior (Badge)
                          </label>
                          <input
                            type="text"
                            value={editingLandingPage.badgeText || ''}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, badgeText: e.target.value })
                            }
                            placeholder="Ex: Lançamento Exclusivo Alphaville"
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Texto do Botão Principal (CTA)
                          </label>
                          <input
                            type="text"
                            value={editingLandingPage.ctaText || ''}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, ctaText: e.target.value })
                            }
                            placeholder="Ex: Solicitar Apresentação Privativa"
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Headline Principal *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingLandingPage.headline}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, headline: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                            Subheadline Persuasiva
                          </label>
                          <textarea
                            rows={3}
                            value={editingLandingPage.subheadline}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, subheadline: e.target.value })
                            }
                            className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32] focus:outline-none focus:border-[#586E5E]"
                          />
                        </div>
                      </div>

                      {/* Landing Page Media (Vercel Blob Compressed Photo + Hero Video) */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-3">
                          <label className="block text-xs uppercase font-semibold text-[#2D3B32]">
                            Foto Principal da Landing Page
                          </label>
                          <MediaUploadDropzone
                            mode="image"
                            folder="landing-pages"
                            multiple={false}
                            label="Subir Capa Comprimida para Landing Page"
                            onUploaded={(urls) => {
                              setEditingLandingPage((prev) =>
                                prev ? { ...prev, coverImage: urls[0] } : prev
                              );
                            }}
                          />
                          <input
                            type="url"
                            value={editingLandingPage.coverImage}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, coverImage: e.target.value })
                            }
                            placeholder="Ou URL da foto de capa..."
                            className="w-full p-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32]"
                          />
                        </div>

                        <div className="p-4 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-3">
                          <label className="block text-xs uppercase font-semibold text-[#2D3B32]">
                            Vídeo Hero / Tour (Opcional · Vercel Blob)
                          </label>
                          <MediaUploadDropzone
                            mode="video"
                            folder="videos"
                            multiple={false}
                            label="Subir Vídeo Principal da Landing Page"
                            onUploaded={(urls) => {
                              setEditingLandingPage((prev) =>
                                prev ? { ...prev, videoUrl: urls[0] } : prev
                              );
                            }}
                          />
                          <input
                            type="url"
                            value={editingLandingPage.videoUrl || ''}
                            onChange={(e) =>
                              setEditingLandingPage({ ...editingLandingPage, videoUrl: e.target.value })
                            }
                            placeholder="Ou URL de vídeo MP4/WebM..."
                            className="w-full p-2 bg-white border border-[#E3DACF] rounded-lg text-xs text-[#2D3B32]"
                          />
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-2">
                        <label className="block text-xs uppercase font-semibold text-[#2D3B32]/85">
                          Diferenciais Destacados na Landing Page
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newLpFeatureInput}
                            onChange={(e) => setNewLpFeatureInput(e.target.value)}
                            placeholder="Ex: Varanda gourmet com churrasqueira integrada..."
                            className="flex-1 p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs text-[#2D3B32]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (!newLpFeatureInput.trim()) return;
                              setEditingLandingPage({
                                ...editingLandingPage,
                                features: [...editingLandingPage.features, newLpFeatureInput.trim()],
                              });
                              setNewLpFeatureInput('');
                            }}
                            className="bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-4 rounded-full text-xs font-semibold cursor-pointer"
                          >
                            Adicionar
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {editingLandingPage.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 bg-[#E6ECE6] text-[#2D3B32] px-3 py-1 rounded-full text-xs"
                            >
                              <span>{feat}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingLandingPage({
                                    ...editingLandingPage,
                                    features: editingLandingPage.features.filter((_, i) => i !== idx),
                                  })
                                }
                                className="text-[#9B4D32] cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E3DACF] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingLandingPage(null)}
                          className="px-5 py-2.5 rounded-full text-xs uppercase tracking-wider text-[#2D3B32]/80 hover:bg-[#F3EDE4] cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-[#B55D3E] hover:bg-[#9B4D32] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-7 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer shadow"
                        >
                          <Save className="w-4 h-4" />
                          {actionLoading ? 'Publicando...' : 'Salvar Landing Page & Gerar Link'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 4: LEADS & VISITS */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-serif text-3xl font-light text-[#2D3B32]">Leads & Solicitações de Visita</h2>
                    <p className="text-xs text-[#586E5E] mt-1">
                      Atualizações gravadas diretamente no Firestore em tempo real.
                    </p>
                  </div>

                  {leads.length === 0 ? (
                    <div className="bg-white p-12 text-center border border-[#E3DACF] rounded-2xl text-xs text-[#586E5E]">
                      Nenhum contato recebido até o momento.
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E3DACF] rounded-2xl overflow-x-auto shadow-xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F3EDE4] text-[#2D3B32] uppercase font-semibold border-b border-[#E3DACF]">
                          <tr>
                            <th className="p-4">Interessado</th>
                            <th className="p-4">Contato</th>
                            <th className="p-4">Imóvel</th>
                            <th className="p-4">Anotações</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E3DACF]">
                          {leads.map((lead) => {
                            const cleanPhone = lead.phone.replace(/\D/g, '');
                            const waLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                              `Olá, ${lead.name}! Sou ${siteSettings.professionalName}. Recebi sua solicitação para "${lead.propertyTitle || 'imóveis em Alphaville'}". Como posso ajudar?`
                            )}`;
                            const noteValue = leadNotesDraft[lead.id] ?? (lead.notes || '');

                            return (
                              <tr key={lead.id} className="hover:bg-[#FAF7F2]">
                                <td className="p-4 font-medium text-[#2D3B32]">
                                  {lead.name}
                                  {lead.email && <div className="text-[11px] text-[#586E5E]">{lead.email}</div>}
                                  {lead.utmSource && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#E6ECE6] text-[#2D3B32] rounded-full text-[10px]">
                                      Origem: {lead.utmSource}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 font-mono text-[#2D3B32]">{lead.phone}</td>
                                <td className="p-4 max-w-xs text-[#2D3B32]">
                                  <div className="line-clamp-2">{lead.propertyTitle || 'Geral'}</div>
                                  <div className="text-[11px] text-[#586E5E]">
                                    {lead.suggestedDate || 'Data a combinar'} · {lead.preferredContactTime}
                                  </div>
                                </td>
                                <td className="p-4 min-w-[180px]">
                                  <input
                                    type="text"
                                    value={noteValue}
                                    onChange={(e) =>
                                      setLeadNotesDraft((prev) => ({ ...prev, [lead.id]: e.target.value }))
                                    }
                                    onBlur={() => {
                                      if (noteValue !== (lead.notes || '')) {
                                        updateLeadStatus(lead.id, lead.status, noteValue);
                                        triggerNotice('Nota do lead salva no Firestore!');
                                      }
                                    }}
                                    placeholder="Adicionar nota..."
                                    className="w-full p-1.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-lg text-[11px]"
                                  />
                                </td>
                                <td className="p-4">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => {
                                      updateLeadStatus(lead.id, e.target.value as Lead['status']);
                                      triggerNotice('Status do lead atualizado!');
                                    }}
                                    className="bg-[#F3EDE4] border border-[#E3DACF] rounded-lg text-[11px] text-[#2D3B32] p-1.5 focus:outline-none focus:border-[#586E5E]"
                                  >
                                    <option value="new">Novo</option>
                                    <option value="in_progress">Em atendimento</option>
                                    <option value="visit_requested">Visita solicitada</option>
                                    <option value="visit_confirmed">Visita confirmada</option>
                                    <option value="proposal_active">Proposta ativa</option>
                                    <option value="converted">Convertido</option>
                                    <option value="closed">Encerrado</option>
                                  </select>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="inline-flex items-center gap-2">
                                    <a
                                      href={waLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 bg-[#586E5E] hover:bg-[#495C4E] text-[#FAF7F2] px-3 py-1.5 rounded-full text-[11px] font-medium"
                                    >
                                      <Phone className="w-3 h-3" />
                                      WhatsApp
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (window.confirm(`Remover lead "${lead.name}"?`)) {
                                          deleteLead(lead.id);
                                        }
                                      }}
                                      className="p-1.5 text-[#B55D3E] hover:text-[#9B4D32] cursor-pointer"
                                      title="Remover lead"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CONFIGURAÇÕES DO SITE (REAL-TIME GLOBAL CMS) */}
              {activeTab === 'settings' && (
                <form
                  onSubmit={handleSaveSettingsSubmit}
                  className="bg-white p-6 sm:p-8 border border-[#E3DACF] rounded-2xl space-y-6 shadow-sm"
                >
                  <div className="border-b border-[#E3DACF] pb-4">
                    <h2 className="font-serif text-3xl font-light text-[#2D3B32]">
                      Configurações Gerais & Identidade Visual
                    </h2>
                    <p className="text-xs text-[#586E5E] mt-1">
                      Tudo o que você editar aqui atualiza o site inteiro em tempo real e permanece salvo no Firestore.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-3">
                      <label className="block text-xs uppercase font-semibold text-[#2D3B32]">
                        Logo Oficial (Vercel Blob / URL)
                      </label>
                      <MediaUploadDropzone
                        mode="image"
                        folder="branding"
                        multiple={false}
                        label="Subir Nova Logo Comprimida"
                        onUploaded={(urls) =>
                          setEditingSettings((prev) => ({ ...prev, logoUrl: urls[0] }))
                        }
                      />
                      <input
                        type="url"
                        value={editingSettings.logoUrl || ''}
                        onChange={(e) => setEditingSettings({ ...editingSettings, logoUrl: e.target.value })}
                        className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div className="p-4 bg-[#FAF7F2] border border-[#E3DACF] rounded-2xl space-y-3">
                      <label className="block text-xs uppercase font-semibold text-[#2D3B32]">
                        Foto da Corretora (Seção Sobre · Vercel Blob / URL)
                      </label>
                      <MediaUploadDropzone
                        mode="image"
                        folder="branding"
                        multiple={false}
                        label="Subir Foto Atualizada da Corretora"
                        onUploaded={(urls) =>
                          setEditingSettings((prev) => ({ ...prev, aboutImageUrl: urls[0] }))
                        }
                      />
                      <input
                        type="url"
                        value={editingSettings.aboutImageUrl || ''}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, aboutImageUrl: e.target.value })
                        }
                        className="w-full p-2.5 bg-white border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Nome Profissional
                      </label>
                      <input
                        type="text"
                        value={editingSettings.professionalName}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, professionalName: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        WhatsApp Oficial (somente números com DDD)
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 11999999999"
                        value={editingSettings.whatsappNumber}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Instagram (@usuario)
                      </label>
                      <input
                        type="text"
                        value={editingSettings.instagramHandle}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, instagramHandle: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={editingSettings.facebookName}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, facebookName: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        E-mail Comercial
                      </label>
                      <input
                        type="email"
                        value={editingSettings.contactEmail}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, contactEmail: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        CRECI
                      </label>
                      <input
                        type="text"
                        value={editingSettings.creciNumber}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, creciNumber: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Título Principal do Hero
                      </label>
                      <input
                        type="text"
                        value={editingSettings.heroHeadline}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, heroHeadline: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Subtítulo do Hero
                      </label>
                      <textarea
                        rows={2}
                        value={editingSettings.heroSubheadline}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, heroSubheadline: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase font-semibold mb-1 text-[#2D3B32]/85">
                        Bio da Corretora (Seção Sobre)
                      </label>
                      <textarea
                        rows={3}
                        value={editingSettings.bioDescription}
                        onChange={(e) =>
                          setEditingSettings({ ...editingSettings, bioDescription: e.target.value })
                        }
                        className="w-full p-2.5 bg-[#FAF7F2] border border-[#E3DACF] rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E3DACF] flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-[#2D3B32] hover:bg-[#3B4D41] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold px-7 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer shadow"
                    >
                      <Save className="w-4 h-4 text-[#E29578]" />
                      {actionLoading ? 'Salvando...' : 'Salvar em Tempo Real'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
