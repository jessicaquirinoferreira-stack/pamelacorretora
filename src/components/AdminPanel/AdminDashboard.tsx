import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Property, Lead, SiteSettings } from '../../types';
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
  MessageSquare,
  LogOut,
  LogIn,
  Eye,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, login, logout } = useAuth();
  const {
    properties,
    siteSettings,
    leads,
    saveProperty,
    deleteProperty,
    saveSiteSettings,
    updateLeadStatus,
    seedInitialDataToFirestore,
  } = useData();

  const [activeTab, setActiveTab] = useState<'metrics' | 'properties' | 'leads' | 'settings'>('metrics');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingNewProperty, setIsCreatingNewProperty] = useState(false);
  const [editingSettings, setEditingSettings] = useState<SiteSettings>(siteSettings);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('admin@x.com');
  const [loginPassword, setLoginPassword] = useState('admin4321');
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  // Notification helper
  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(''), 3000);
  };

  // Seeding action
  const handleSeedData = async () => {
    if (!window.confirm('Deseja salvar/sincronizar os imóveis de referência e dados no Firestore agora?')) return;
    setActionLoading(true);
    try {
      await seedInitialDataToFirestore();
      triggerNotice('Imóveis e configurações provisionados no Firestore com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao gravar dados no Firestore. Verifique as permissões de administrador.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save property
  const handleSavePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setActionLoading(true);
    try {
      await saveProperty(editingProperty);
      setEditingProperty(null);
      setIsCreatingNewProperty(false);
      triggerNotice('Imóvel salvo com sucesso no Firestore!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar imóvel.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete property
  const handleDeleteProperty = async (id: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o imóvel "${title}"?`)) return;
    setActionLoading(true);
    try {
      await deleteProperty(id);
      triggerNotice('Imóvel removido com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir imóvel.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Settings
  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await saveSiteSettings(editingSettings);
      triggerNotice('Configurações do site salvas no Firestore!');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar configurações.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#192b20]/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      <div className="bg-[#fbf9f5] w-full max-w-6xl rounded-sm overflow-hidden shadow-2xl border border-[#e8e2d9] flex flex-col max-h-[95vh] relative text-[#192b20]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#e8e2d9] bg-[#192b20] text-[#fbf9f5] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-2xl font-medium tracking-wide">
              Painel Administrativo
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-[#c5a880] text-[#192b20] px-2 py-0.5 font-bold rounded-sm">
              Pâmela Boccaletti
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#fbf9f5]/70 hidden sm:inline">
                  {user.email} {isAdmin ? '(Admin Autorizado)' : '(Aguardando autorização)'}
                </span>
                <button
                  onClick={logout}
                  className="bg-[#243d2e] hover:bg-[#3b5242] text-[#fbf9f5] text-xs px-3 py-1.5 rounded-sm flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            ) : null}

            <button
              onClick={onClose}
              className="p-1 text-[#fbf9f5]/70 hover:text-[#fbf9f5] rounded-sm transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Success toast */}
        {saveSuccessNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4" />
            {saveSuccessNotice}
          </div>
        )}

        {/* Authenticated Check View */}
        {!user ? (
          <div className="p-8 sm:p-10 text-center space-y-4 max-w-md mx-auto my-auto">
            <div className="w-12 h-12 bg-[#f0ebe1] rounded-full mx-auto flex items-center justify-center text-[#192b20]">
              <LogIn className="w-6 h-6 text-[#c5a880]" />
            </div>
            <h3 className="font-serif text-2xl font-medium">Acesso Privado ao Painel</h3>
            <p className="text-xs text-[#192b20]/75 leading-relaxed">
              Área restrita para gerenciar imóveis e leads. Entre com as credenciais de administrador.
            </p>
            {loginError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-sm border border-red-200">
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
                <label className="block text-xs uppercase font-medium mb-1 text-[#192b20]/80">E-mail</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-medium mb-1 text-[#192b20]/80">Senha</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#e8e2d9] rounded-sm text-xs text-[#192b20] focus:outline-none focus:border-[#192b20]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] font-semibold text-xs uppercase tracking-wider py-3 px-4 rounded-full flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
              >
                <LogIn className="w-4 h-4 text-[#c5a880]" />
                Entrar no Painel
              </button>
            </form>
            <p className="text-[11px] text-[#192b20]/50 pt-2 font-mono">
              Login: admin@x.com | Senha: admin4321
            </p>
          </div>
        ) : !isAdmin ? (
          <div className="p-10 text-center space-y-4 max-w-md mx-auto my-auto">
            <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="font-serif text-2xl font-medium">Conta Não Autorizada</h3>
            <p className="text-xs text-[#192b20]/75 leading-relaxed">
              Você está conectado como <strong>{user.email}</strong>, mas esta conta não possui
              permissão de administrador cadastrada no Firebase Firestore.
            </p>
            <div className="pt-2">
              <button
                onClick={logout}
                className="bg-[#192b20] text-[#fbf9f5] text-xs uppercase tracking-wider py-2 px-4 rounded-sm"
              >
                Trocar de Conta
              </button>
            </div>
          </div>
        ) : (
          /* Admin Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#e8e2d9] bg-[#f0ebe1] px-4 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab('metrics');
                  setEditingProperty(null);
                  setIsCreatingNewProperty(false);
                }}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'metrics'
                    ? 'border-[#192b20] text-[#192b20]'
                    : 'border-transparent text-[#192b20]/60 hover:text-[#192b20]'
                }`}
              >
                <Database className="w-4 h-4" />
                Visão Geral
              </button>

              <button
                onClick={() => {
                  setActiveTab('properties');
                  setEditingProperty(null);
                  setIsCreatingNewProperty(false);
                }}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'properties'
                    ? 'border-[#192b20] text-[#192b20]'
                    : 'border-transparent text-[#192b20]/60 hover:text-[#192b20]'
                }`}
              >
                <Home className="w-4 h-4" />
                Imóveis ({properties.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('leads');
                  setEditingProperty(null);
                  setIsCreatingNewProperty(false);
                }}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'border-[#192b20] text-[#192b20]'
                    : 'border-transparent text-[#192b20]/60 hover:text-[#192b20]'
                }`}
              >
                <Users className="w-4 h-4" />
                Leads e Visitas ({leads.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setEditingProperty(null);
                  setIsCreatingNewProperty(false);
                  setEditingSettings(siteSettings);
                }}
                className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-[#192b20] text-[#192b20]'
                    : 'border-transparent text-[#192b20]/60 hover:text-[#192b20]'
                }`}
              >
                <Settings className="w-4 h-4" />
                Configurações & Contatos
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* TAB 1: METRICS */}
              {activeTab === 'metrics' && (
                <div className="space-y-6">
                  {/* Quick Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 border border-[#e8e2d9] rounded-sm">
                      <span className="text-[10px] uppercase tracking-wider text-[#819885] font-semibold block">
                        Imóveis Ativos
                      </span>
                      <div className="font-serif text-3xl font-medium mt-1">
                        {properties.filter((p) => p.status === 'published').length}
                      </div>
                      <span className="text-xs text-[#192b20]/60">
                        de {properties.length} cadastrados
                      </span>
                    </div>

                    <div className="bg-white p-4 border border-[#e8e2d9] rounded-sm">
                      <span className="text-[10px] uppercase tracking-wider text-[#819885] font-semibold block">
                        Para Venda
                      </span>
                      <div className="font-serif text-3xl font-medium mt-1">
                        {properties.filter((p) => p.transactionType === 'sale').length}
                      </div>
                      <span className="text-xs text-[#192b20]/60">unidades à venda</span>
                    </div>

                    <div className="bg-white p-4 border border-[#e8e2d9] rounded-sm">
                      <span className="text-[10px] uppercase tracking-wider text-[#819885] font-semibold block">
                        Para Locação
                      </span>
                      <div className="font-serif text-3xl font-medium mt-1">
                        {properties.filter((p) => p.transactionType === 'rent').length}
                      </div>
                      <span className="text-xs text-[#192b20]/60">unidades locação</span>
                    </div>

                    <div className="bg-white p-4 border border-[#e8e2d9] rounded-sm">
                      <span className="text-[10px] uppercase tracking-wider text-[#819885] font-semibold block">
                        Solicitações de Visita
                      </span>
                      <div className="font-serif text-3xl font-medium mt-1 text-[#3b5242]">
                        {leads.length}
                      </div>
                      <span className="text-xs text-[#192b20]/60">leads gravados</span>
                    </div>
                  </div>

                  {/* Seed & Sync Callout */}
                  <div className="bg-[#f0ebe1] p-6 border border-[#e8e2d9] rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-xl font-medium text-[#192b20]">
                        Sincronização com o Firestore em Tempo Real
                      </h4>
                      <p className="text-xs text-[#192b20]/75 mt-1 max-w-xl">
                        Clique abaixo para gravar ou restabelecer os 4 anúncios de referência (Alpha Vita,
                        Jardins de Tamboré venda, Jardins de Tamboré locação mobiliado) diretamente no seu
                        banco de dados Firestore.
                      </p>
                    </div>

                    <button
                      onClick={handleSeedData}
                      disabled={actionLoading}
                      className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold py-2.5 px-5 rounded-sm transition-colors whitespace-nowrap shadow flex items-center gap-2"
                    >
                      <Database className="w-4 h-4 text-[#c5a880]" />
                      Sincronizar no Firestore
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: PROPERTIES */}
              {activeTab === 'properties' && (
                <div className="space-y-6">
                  {/* Top Bar */}
                  {!editingProperty && (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#192b20]/70">
                        Gerencie anúncios, preços, status e galerias fotográficas.
                      </div>
                      <button
                        onClick={() => {
                          const newProp: Property = {
                            id: `prop-${Date.now()}`,
                            title: '',
                            slug: '',
                            code: `PB-${Math.floor(100 + Math.random() * 900)}`,
                            transactionType: 'sale',
                            propertyType: 'apartment',
                            price: 0,
                            condominiumName: 'Jardins de Tamboré',
                            region: 'Alphaville/SP',
                            areaM2: 100,
                            bedrooms: 3,
                            suites: 2,
                            bathrooms: 3,
                            halfBaths: 1,
                            parkingSpots: 2,
                            storageUnit: true,
                            furnished: false,
                            gourmetBalcony: false,
                            expandedLivingRoom: false,
                            description: '',
                            features: ['Atendimento exclusivo Pâmela Boccaletti'],
                            coverImage:
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                            gallery: [
                              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                            ],
                            status: 'published',
                            featured: false,
                            pendingConfirmation: true,
                            order: properties.length + 1,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                          };
                          setEditingProperty(newProp);
                          setIsCreatingNewProperty(true);
                        }}
                        className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4 text-[#c5a880]" />
                        Novo Imóvel
                      </button>
                    </div>
                  )}

                  {/* Property Form */}
                  {editingProperty ? (
                    <form onSubmit={handleSavePropertySubmit} className="bg-white p-6 border border-[#e8e2d9] rounded-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#e8e2d9]">
                        <h4 className="font-serif text-xl font-medium">
                          {isCreatingNewProperty ? 'Cadastrar Novo Imóvel' : 'Editar Imóvel'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="text-xs uppercase tracking-wider text-[#192b20]/60 hover:text-[#192b20]"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-medium mb-1">Título do Imóvel *</label>
                          <input
                            type="text"
                            required
                            value={editingProperty.title}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                title: e.target.value,
                                slug: e.target.value
                                  .toLowerCase()
                                  .replace(/[^\w\s-]/g, '')
                                  .replace(/\s+/g, '-'),
                              })
                            }
                            placeholder="Ex: Apartamento 3 Dormitórios no Jardins de Tamboré"
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Condomínio *</label>
                          <input
                            type="text"
                            required
                            value={editingProperty.condominiumName}
                            onChange={(e) => setEditingProperty({ ...editingProperty, condominiumName: e.target.value })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Região</label>
                          <input
                            type="text"
                            value={editingProperty.region}
                            onChange={(e) => setEditingProperty({ ...editingProperty, region: e.target.value })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Tipo de Negócio *</label>
                          <select
                            value={editingProperty.transactionType}
                            onChange={(e) =>
                              setEditingProperty({
                                ...editingProperty,
                                transactionType: e.target.value as 'sale' | 'rent',
                              })
                            }
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          >
                            <option value="sale">Venda</option>
                            <option value="rent">Locação</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Preço (R$) *</label>
                          <input
                            type="number"
                            required
                            value={editingProperty.price}
                            onChange={(e) => setEditingProperty({ ...editingProperty, price: Number(e.target.value) })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Área Privativa (m²)</label>
                          <input
                            type="number"
                            value={editingProperty.areaM2 || ''}
                            onChange={(e) => setEditingProperty({ ...editingProperty, areaM2: Number(e.target.value) })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Dormitórios</label>
                          <input
                            type="number"
                            value={editingProperty.bedrooms || ''}
                            onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Suítes</label>
                          <input
                            type="number"
                            value={editingProperty.suites || ''}
                            onChange={(e) => setEditingProperty({ ...editingProperty, suites: Number(e.target.value) })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-medium mb-1">Vagas de Garagem</label>
                          <input
                            type="number"
                            value={editingProperty.parkingSpots || ''}
                            onChange={(e) => setEditingProperty({ ...editingProperty, parkingSpots: Number(e.target.value) })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-medium mb-1">URL da Foto de Capa</label>
                          <input
                            type="url"
                            value={editingProperty.coverImage}
                            onChange={(e) => setEditingProperty({ ...editingProperty, coverImage: e.target.value })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-xs uppercase font-medium mb-1">Galeria de Fotos (Múltiplas Fotos)</label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              id="new-gallery-url"
                              placeholder="Cole a URL de uma foto adicional da galeria..."
                              className="flex-1 p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('new-gallery-url') as HTMLInputElement;
                                if (input && input.value.trim()) {
                                  const currentGallery = editingProperty.gallery || [];
                                  setEditingProperty({
                                    ...editingProperty,
                                    gallery: [...currentGallery, input.value.trim()],
                                  });
                                  input.value = '';
                                }
                              }}
                              className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] px-4 py-2 text-xs rounded-full font-semibold uppercase cursor-pointer"
                            >
                              Adicionar Foto
                            </button>
                          </div>
                          {editingProperty.gallery && editingProperty.gallery.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                              {editingProperty.gallery.map((imgUrl, gIdx) => (
                                <div key={gIdx} className="relative group aspect-[16/10] bg-black rounded-sm overflow-hidden border border-[#e8e2d9]">
                                  <img src={imgUrl} alt={`Galeria ${gIdx + 1}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = editingProperty.gallery.filter((_, i) => i !== gIdx);
                                      setEditingProperty({ ...editingProperty, gallery: updated });
                                    }}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm text-[10px] opacity-90 hover:opacity-100 cursor-pointer"
                                    title="Remover foto"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs uppercase font-medium mb-1">Descrição</label>
                          <textarea
                            rows={3}
                            value={editingProperty.description}
                            onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                            className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-4 sm:col-span-2">
                          <label className="inline-flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={editingProperty.pendingConfirmation}
                              onChange={(e) => setEditingProperty({ ...editingProperty, pendingConfirmation: e.target.checked })}
                            />
                            Pendente de confirmação
                          </label>

                          <label className="inline-flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={editingProperty.storageUnit || false}
                              onChange={(e) => setEditingProperty({ ...editingProperty, storageUnit: e.target.checked })}
                            />
                            Depósito no andar
                          </label>

                          <label className="inline-flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={editingProperty.furnished || false}
                              onChange={(e) => setEditingProperty({ ...editingProperty, furnished: e.target.checked })}
                            />
                            Mobiliado
                          </label>

                          <label className="inline-flex items-center gap-1.5 text-xs">
                            <input
                              type="checkbox"
                              checked={editingProperty.gourmetBalcony || false}
                              onChange={(e) => setEditingProperty({ ...editingProperty, gourmetBalcony: e.target.checked })}
                            />
                            Varanda Gourmet
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#e8e2d9] flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProperty(null)}
                          className="px-4 py-2 text-xs uppercase tracking-wider text-[#192b20]/70"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-sm flex items-center gap-2"
                        >
                          <Save className="w-4 h-4 text-[#c5a880]" />
                          Salvar Imóvel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Properties Table */
                    <div className="bg-white border border-[#e8e2d9] rounded-sm overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f0ebe1] text-[#192b20] uppercase font-semibold border-b border-[#e8e2d9]">
                          <tr>
                            <th className="p-3">Imóvel</th>
                            <th className="p-3">Condomínio</th>
                            <th className="p-3">Tipo</th>
                            <th className="p-3">Preço</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e2d9]">
                          {properties.map((prop) => (
                            <tr key={prop.id} className="hover:bg-[#fbf9f5]">
                              <td className="p-3">
                                <div className="font-semibold text-[#192b20] line-clamp-1">{prop.title}</div>
                                <div className="text-[10px] text-[#819885]">{prop.code || prop.id}</div>
                              </td>
                              <td className="p-3">{prop.condominiumName}</td>
                              <td className="p-3">
                                <span className="uppercase text-[10px] font-semibold">
                                  {prop.transactionType === 'sale' ? 'Venda' : 'Locação'}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">
                                R$ {prop.price.toLocaleString('pt-BR')}
                              </td>
                              <td className="p-3">
                                {prop.pendingConfirmation ? (
                                  <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-xs text-[10px]">
                                    A Confirmar
                                  </span>
                                ) : (
                                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs text-[10px]">
                                    Publicado
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => setEditingProperty(prop)}
                                  className="p-1.5 text-[#192b20]/70 hover:text-[#192b20]"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                  className="p-1.5 text-red-600 hover:text-red-800"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LEADS & VISITS */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="text-xs text-[#192b20]/70">
                    Solicitações de visitas gravadas no Firestore em tempo real.
                  </div>

                  {leads.length === 0 ? (
                    <div className="bg-white p-10 text-center border border-[#e8e2d9] rounded-sm text-xs text-[#192b20]/60">
                      Nenhum contato ou solicitação de visita recebida até o momento.
                    </div>
                  ) : (
                    <div className="bg-white border border-[#e8e2d9] rounded-sm overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#f0ebe1] text-[#192b20] uppercase font-semibold border-b border-[#e8e2d9]">
                          <tr>
                            <th className="p-3">Interessado</th>
                            <th className="p-3">Contato</th>
                            <th className="p-3">Imóvel de Interesse</th>
                            <th className="p-3">Data / Horário</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Ação WhatsApp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e2d9]">
                          {leads.map((lead) => {
                            const cleanPhone = lead.phone.replace(/\D/g, '');
                            const waLink = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                              `Olá, ${lead.name}! Sou Pâmela Boccaletti. Recebi sua solicitação de visita para o imóvel "${lead.propertyTitle}". Como posso ajudar?`
                            )}`;

                            return (
                              <tr key={lead.id} className="hover:bg-[#fbf9f5]">
                                <td className="p-3 font-medium">
                                  {lead.name}
                                  {lead.email && <div className="text-[10px] text-[#192b20]/60">{lead.email}</div>}
                                </td>
                                <td className="p-3 font-mono">{lead.phone}</td>
                                <td className="p-3 line-clamp-1 max-w-xs">{lead.propertyTitle || 'Não especificado'}</td>
                                <td className="p-3">
                                  {lead.suggestedDate || 'A combinar'}
                                  <div className="text-[10px] text-[#819885]">{lead.preferredContactTime}</div>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                                    className="bg-[#f0ebe1] border border-[#e8e2d9] rounded-sm text-[10px] p-1"
                                  >
                                    <option value="new">Novo</option>
                                    <option value="in_progress">Em atendimento</option>
                                    <option value="visit_requested">Visita solicitada</option>
                                    <option value="visit_confirmed">Visita confirmada</option>
                                    <option value="converted">Convertido</option>
                                    <option value="closed">Encerrado</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-sm text-[11px]"
                                  >
                                    <Phone className="w-3 h-3" />
                                    WhatsApp
                                  </a>
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

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettingsSubmit} className="bg-white p-6 border border-[#e8e2d9] rounded-sm space-y-4 max-w-3xl">
                  <h4 className="font-serif text-xl font-medium border-b border-[#e8e2d9] pb-3">
                    Informações Institucionais e Contatos Oficiais
                  </h4>
                  <p className="text-xs text-[#192b20]/70">
                    Defina seu WhatsApp oficial, telefone de contato, número de CRECI e bio da corretora.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase font-medium mb-1">URL do Logo Oficial (Fundo Transparente)</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <input
                          type="url"
                          value={editingSettings.logoUrl || ''}
                          onChange={(e) => setEditingSettings({ ...editingSettings, logoUrl: e.target.value })}
                          placeholder="https://i.postimg.cc/rFdvLgbL/Logo-luxuoso-Pamela-Boccaletti-em-dourado-e-preto.png"
                          className="flex-1 w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                        />
                        {editingSettings.logoUrl && (
                          <div className="p-2 bg-[#192b20] rounded-sm flex items-center justify-center border border-[#3b5242]">
                            <img
                              src={editingSettings.logoUrl}
                              alt="Pré-visualização do Logo"
                              className="h-8 w-auto object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">Nome Profissional</label>
                      <input
                        type="text"
                        value={editingSettings.professionalName}
                        onChange={(e) => setEditingSettings({ ...editingSettings, professionalName: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">Número de WhatsApp Oficial</label>
                      <input
                        type="tel"
                        placeholder="Ex: 11999999999"
                        value={editingSettings.whatsappNumber}
                        onChange={(e) => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">Telefone Comercial</label>
                      <input
                        type="tel"
                        placeholder="Ex: (11) 4195-0000"
                        value={editingSettings.contactPhone}
                        onChange={(e) => setEditingSettings({ ...editingSettings, contactPhone: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">E-mail Comercial</label>
                      <input
                        type="email"
                        placeholder="contato@pamelaboccaletti.com.br"
                        value={editingSettings.contactEmail}
                        onChange={(e) => setEditingSettings({ ...editingSettings, contactEmail: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">CRECI</label>
                      <input
                        type="text"
                        placeholder="Ex: 123456-F"
                        value={editingSettings.creciNumber}
                        onChange={(e) => setEditingSettings({ ...editingSettings, creciNumber: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-medium mb-1">Região de Atuação</label>
                      <input
                        type="text"
                        value={editingSettings.region}
                        onChange={(e) => setEditingSettings({ ...editingSettings, region: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase font-medium mb-1">Texto de Apresentação (Bio)</label>
                      <textarea
                        rows={3}
                        value={editingSettings.bioDescription}
                        onChange={(e) => setEditingSettings({ ...editingSettings, bioDescription: e.target.value })}
                        className="w-full p-2 bg-[#fbf9f5] border border-[#e8e2d9] rounded-sm text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#e8e2d9] flex justify-end">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="bg-[#192b20] hover:bg-[#243d2e] text-[#fbf9f5] text-xs uppercase tracking-wider font-semibold px-6 py-2.5 rounded-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4 text-[#c5a880]" />
                      Salvar Configurações
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
