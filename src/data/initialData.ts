import { Property, SiteSettings, LandingPage } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  professionalName: 'Pâmela Boccaletti',
  logoUrl: 'https://i.postimg.cc/bNDNFx92/Logo-Imobiliario-Dourado-Pamela-Boccaletti.png',
  bioTagline: 'Imóveis em Alphaville/SP · Atendimento Exclusivo',
  bioDescription:
    'Sou Pâmela Boccaletti e atuo com imóveis em Alphaville/SP. Meu compromisso é oferecer atendimento exclusivo, entender suas prioridades e acompanhar você na busca pelo imóvel ideal. Me chama e agende uma visita.',
  region: 'Alphaville, Barueri/Santana de Parnaíba - SP',
  instagramHandle: '@pamelaboccaletti',
  facebookName: 'Pamela Boccaletti',
  whatsappNumber: '', // A definir no painel
  contactPhone: '', // A definir no painel
  contactEmail: '', // A definir no painel
  creciNumber: '', // A definir no painel
  officeAddress: '', // Endereço não divulgado publicamente
  heroHeadline: 'Encontre seu lugar em Alphaville.',
  heroSubheadline:
    'Uma seleção de imóveis para comprar ou alugar, com atendimento exclusivo e acompanhamento personalizado por Pâmela Boccaletti.',
  legalDisclaimers:
    'Os valores, disponibilidades e características dos imóveis divulgados foram extraídos de registros históricos de anúncios e estão sujeitos a confirmação expressa antes de qualquer ato de compra ou locação. Não são divulgados endereços exatos sem prévia autorização.',
  updatedAt: new Date().toISOString(),
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-alpha-vita-venda',
    title: 'Apartamento Contemporâneo no Condomínio Alpha Vita',
    slug: 'apartamento-condominio-alpha-vita-venda',
    code: 'PB-AV01',
    transactionType: 'sale',
    propertyType: 'apartment',
    price: 1940000,
    condominiumName: 'Alpha Vita',
    region: 'Alphaville/SP',
    description:
      'Imóvel anunciado no prestigiado Condomínio Alpha Vita. Sala de estar espaçosa e integrada com a varanda, decoração contemporânea com acabamento sofisticado e iluminação natural generosa. Metragem exata, dormitórios e vagas pendentes de confirmação pela corretora.',
    features: [
      'Sala integrada à varanda',
      'Decoração contemporânea',
      'Acabamento sofisticado',
      'Condomínio com lazer completo',
      'Ambiente amplo e arejado',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1400&q=80',
    ],
    status: 'published',
    featured: true,
    pendingConfirmation: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-jardins-tambore-venda',
    title: 'Apartamento 3 Dormitórios no Jardins de Tamboré',
    slug: 'apartamento-jardins-de-tambore-venda',
    code: 'PB-JT02',
    transactionType: 'sale',
    propertyType: 'apartment',
    price: 1100000,
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
    description:
      'Apartamento com 100 m² no procurado Jardins de Tamboré em Alphaville. Configuração equilibrada com 3 dormitórios sendo 2 suítes, lavabo, 2 vagas de garagem demarcadas e depósito privativo no próprio andar. Sala de estar com decoração contemporânea.',
    features: [
      '100 m² de área privativa',
      '3 dormitórios (2 suítes)',
      'Lavabo social',
      '2 vagas de garagem',
      'Depósito privativo no andar',
      'Condomínio Jardins de Tamboré',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
    ],
    status: 'published',
    featured: true,
    pendingConfirmation: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-jardins-tambore-locacao-mobiliado',
    title: 'Apartamento 100 m² Totalmente Mobiliado no Jardins de Tamboré',
    slug: 'apartamento-mobiliado-jardins-de-tambore-locacao',
    code: 'PB-JT03',
    transactionType: 'rent',
    propertyType: 'apartment',
    price: 6900,
    condominiumName: 'Jardins de Tamboré',
    region: 'Alphaville/SP',
    areaM2: 100,
    bedrooms: 1,
    suites: 1,
    bathrooms: 2,
    halfBaths: 1,
    parkingSpots: 2,
    storageUnit: false,
    furnished: true,
    gourmetBalcony: false,
    expandedLivingRoom: false,
    description:
      'Locação no Jardins de Tamboré, Alphaville. Imóvel com 100 m², 1 suíte espaçosa, lavabo, 2 vagas de garagem e anunciado como totalmente mobiliado, com sala de estar e jantar prontas para morar. Valor mensal divulgado de R$ 6.900,00 (consultar despesas de condomínio e IPTU).',
    features: [
      'Totalmente mobiliado',
      '100 m² de área privativa',
      '1 suíte master',
      'Lavabo social',
      '2 vagas de garagem',
      'Sala de estar e jantar decoradas',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80',
    ],
    status: 'published',
    featured: true,
    pendingConfirmation: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prop-jardins-tambore-varanda-gourmet',
    title: 'Apartamento com Varanda Gourmet e Sala Ampliada no Jardins de Tamboré',
    slug: 'apartamento-varanda-gourmet-jardins-de-tambore',
    code: 'PB-JT04',
    transactionType: 'sale',
    propertyType: 'apartment',
    price: 1150000,
    condominiumName: 'Jardins de Tamboré',
    region: 'Alphaville/SP',
    areaM2: 100,
    bedrooms: 2,
    suites: 2,
    bathrooms: 3,
    halfBaths: 0,
    parkingSpots: 2,
    storageUnit: false,
    furnished: false,
    gourmetBalcony: true,
    expandedLivingRoom: true,
    description:
      'Registro oriundo de publicação em vídeo/reel destacando 100 m², planta com 2 suítes, 2 vagas, sala ampliada e varanda gourmet. Disponibilidade e modalidade de negócio (venda ou locação) sob confirmação com a corretora Pâmela Boccaletti.',
    features: [
      '100 m² de área',
      '2 suítes',
      '2 vagas de garagem',
      'Sala ampliada',
      'Varanda gourmet integrada',
      'A confirmar detalhes e disponibilidade',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80',
    ],
    status: 'published',
    featured: false,
    pendingConfirmation: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_LANDING_PAGES: LandingPage[] = [
  {
    id: 'lp-alpha-vita',
    slug: 'oportunidade-alpha-vita',
    title: 'Oportunidade Exclusiva no Condomínio Alpha Vita | Alphaville',
    headline: 'Viva a sofisticação no Condomínio Alpha Vita',
    subheadline:
      'Apartamento com sala integrada à varanda e acabamento de alto padrão. Agende sua visita privativa com Pâmela Boccaletti.',
    propertyId: 'prop-alpha-vita-venda',
    coverImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    features: [
      'Ambiente social amplo e integrado',
      'Condomínio de referência em Alphaville',
      'Atendimento direto e discreto com Pâmela Boccaletti',
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lp-jardins-tambore',
    slug: 'oportunidade-jardins-de-tambore',
    title: 'Seleção Jardins de Tamboré | Alphaville/SP',
    headline: 'Imóveis selecionados no Jardins de Tamboré',
    subheadline:
      'Opções de 100 m² para compra e locação mobiliada. Conheça as unidades com atendimento personalizado.',
    propertyId: 'prop-jardins-tambore-venda',
    coverImage:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    features: [
      'Plantas inteligentes de 100 m²',
      'Opções com suítes e varanda gourmet',
      'Depósito privativo e vagas demarcadas',
    ],
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
