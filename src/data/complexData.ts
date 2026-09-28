export type VenueId = 'laundry' | 'casino' | 'skybar';

export interface VenueSlide {
  id: VenueId;
  name: string;
  wingLabel: string;
  tagline: string;
  description: string;
  accentHex: string;
  accentName: 'cyan' | 'gold' | 'violet';
  imageUrl: string;
  primaryStats: [string, string];
  secondaryMetrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  occupancy: {
    current: number;
    capacity: number;
    unit: string;
    percentage: number;
    peakHour: string;
  };
}

export interface RevenuePoint {
  period: string;
  today: number;
  yesterday: number;
  laundry: number;
  casino: number;
  skybar: number;
}

export interface ComplexEvent {
  id: string;
  time: string;
  title: string;
  venueId: VenueId;
  venueName: string;
  category: 'Torneo' | 'Promo' | 'Degustación' | 'Operativo';
  capacityStatus: string;
}

export interface SystemAlert {
  id: string;
  subsystem: 'Lavarropas' | 'Billeteros' | 'Extractores' | 'Humidores';
  venueId: VenueId;
  venueName: string;
  code: string;
  status: 'nominal' | 'warning' | 'alert';
  statusLabel: string;
  message: string;
  metric: string;
  lastChecked: string;
  acknowledged: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  venueId: VenueId;
  venueName: string;
  shift: string;
  active: boolean;
}

export const VENUE_SLIDES: VenueSlide[] = [
  {
    id: 'laundry',
    name: 'Lavandería',
    wingLabel: 'Ala Norte · Planta Baja',
    tagline: '24 máquinas activas · 12 ciclos en curso',
    description:
      'Estación de lavado industrial de alta eficiencia con dosificación automática por ultrasonido, cabinas de secado rápido y espera conectada con servicio de cafetería y coctelería.',
    accentHex: '#3fd8e8',
    accentName: 'cyan',
    imageUrl: '/src/assets/images/venue_laundry_lounge_1790632957554.jpg',
    primaryStats: ['24 máquinas activas', '12 ciclos en curso'],
    secondaryMetrics: [
      { label: 'Tiempo medio restante', value: '18 min', detail: 'Rotación ágil' },
      { label: 'Presión hidráulica', value: '4.2 bar', detail: 'Flujo nominal' },
      { label: 'Temperatura calderas', value: '62 °C', detail: 'Eco-Termo activo' },
    ],
    occupancy: {
      current: 24,
      capacity: 28,
      unit: 'máquinas operativas',
      percentage: 86,
      peakHour: '19:00 - 22:00',
    },
  },
  {
    id: 'casino',
    name: 'Casino',
    wingLabel: 'Ala Central · Nivel Principal',
    tagline: '8 mesas abiertas · Jackpot: $1.240.000',
    description:
      'Sala de juego nocturna con mesas de Ruleta Americana, Blackjack VIP, Poker Texas Hold’em y terminales progresivas interconectadas en tiempo real.',
    accentHex: '#f2c14e',
    accentName: 'gold',
    imageUrl: '/src/assets/images/venue_casino_floor_1790632969644.jpg',
    primaryStats: ['8 mesas abiertas', 'Jackpot: $1.240.000'],
    secondaryMetrics: [
      { label: 'Terminales Slots', value: '64 / 70', detail: '91% en sesión' },
      { label: 'Pozo Progresivo', value: '$1.240.000', detail: 'Nivel Diamante' },
      { label: 'Mesas VIP', value: '3 activas', detail: 'Ruleta & Blackjack' },
    ],
    occupancy: {
      current: 142,
      capacity: 160,
      unit: 'puestos en sala',
      percentage: 89,
      peakHour: '22:00 - 03:00',
    },
  },
  {
    id: 'skybar',
    name: 'Bar & Fumadores',
    wingLabel: 'Ala Sur · Terraza Cubierta',
    tagline: 'Sky Bar abierto · Ventilación 100%',
    description:
      'Lounge de coctelería de autor y cava climatizada para habanos con sistema de extracción laminar de triple filtrado e inyección de aire puro renovado cada 3 minutos.',
    accentHex: '#a88cff',
    accentName: 'violet',
    imageUrl: '/src/assets/images/venue_skybar_lounge_1790632980222.jpg',
    primaryStats: ['Sky Bar abierto', 'Ventilación 100%'],
    secondaryMetrics: [
      { label: 'Renovación de aire', value: '18 ACH', detail: 'Filtro HEPA + Carbón' },
      { label: 'Cava Humidor', value: '68% HR', detail: '20.4 °C constantes' },
      { label: 'Mesas Lounge', value: '16 / 20', detail: '4 reservas VIP' },
    ],
    occupancy: {
      current: 48,
      capacity: 60,
      unit: 'plazas en lounge',
      percentage: 80,
      peakHour: '21:30 - 02:30',
    },
  },
];

export const REVENUE_DATA: RevenuePoint[] = [
  { period: '12:00', today: 310000, yesterday: 280000, laundry: 115000, casino: 140000, skybar: 55000 },
  { period: '15:00', today: 485000, yesterday: 420000, laundry: 155000, casino: 235000, skybar: 95000 },
  { period: '18:00', today: 740000, yesterday: 665000, laundry: 190000, casino: 390000, skybar: 160000 },
  { period: '21:00', today: 1120000, yesterday: 940000, laundry: 210000, casino: 620000, skybar: 290000 },
  { period: '00:00', today: 1495000, yesterday: 1260000, laundry: 165000, casino: 910000, skybar: 420000 },
  { period: '03:00', today: 1180000, yesterday: 1050000, laundry: 110000, casino: 730000, skybar: 340000 },
];

export const INITIAL_EVENTS: ComplexEvent[] = [
  {
    id: 'evt-1',
    time: '20:30',
    title: 'Promo Wash & Cocktail 2x1 Ciclos Nocturnos',
    venueId: 'laundry',
    venueName: 'Lavandería',
    category: 'Promo',
    capacityStatus: 'Activa en 24 terminales',
  },
  {
    id: 'evt-2',
    time: '22:00',
    title: 'Torneo Blackjack Joker High-Roller',
    venueId: 'casino',
    venueName: 'Casino',
    category: 'Torneo',
    capacityStatus: '28 / 32 inscriptos',
  },
  {
    id: 'evt-3',
    time: '23:15',
    title: 'Cata de Habanos & Bourbon Single Barrel',
    venueId: 'skybar',
    venueName: 'Bar & Fumadores',
    category: 'Degustación',
    capacityStatus: '18 / 20 plazas reservadas',
  },
  {
    id: 'evt-4',
    time: '01:00',
    title: 'Sorteo Pozo Progresivo Ruleta Dorada',
    venueId: 'casino',
    venueName: 'Casino',
    category: 'Promo',
    capacityStatus: 'Abierto a toda la sala',
  },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    subsystem: 'Lavarropas',
    venueId: 'laundry',
    venueName: 'Lavandería',
    code: 'LAV-M14',
    status: 'warning',
    statusLabel: 'Nivel Detergente 18%',
    message: 'Bomba peristáltica #14 requiere recarga de jabón hipoalergénico en 6 ciclos.',
    metric: '24/24 activas · 12 en ciclo',
    lastChecked: 'Hace 2 min',
    acknowledged: false,
  },
  {
    id: 'alt-2',
    subsystem: 'Billeteros',
    venueId: 'casino',
    venueName: 'Casino',
    code: 'BIL-SL09',
    status: 'alert',
    statusLabel: 'Stacker al 92%',
    message: 'Validador de billetes en Isla Slots #09 próximo a capacidad máxima de arqueo.',
    metric: '69/70 operativos',
    lastChecked: 'Hace 1 min',
    acknowledged: false,
  },
  {
    id: 'alt-3',
    subsystem: 'Extractores',
    venueId: 'skybar',
    venueName: 'Bar & Fumadores',
    code: 'EXT-TURBO2',
    status: 'nominal',
    statusLabel: 'Extracción 100%',
    message: 'Caudal de extracción silenciosa operando a 1.850 m³/h con presión negativa estable.',
    metric: 'PM2.5: 9 µg/m³ · Óptimo',
    lastChecked: 'En vivo',
    acknowledged: true,
  },
  {
    id: 'alt-4',
    subsystem: 'Humidores',
    venueId: 'skybar',
    venueName: 'Bar & Fumadores',
    code: 'HUM-CAVA1',
    status: 'nominal',
    statusLabel: 'Clima Estable 68% HR',
    message: 'Control higrométrico de cedro español dentro de parámetros ideales.',
    metric: '20.4 °C · 68% HR',
    lastChecked: 'En vivo',
    acknowledged: true,
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'st-1', name: 'Valentina Quiroga', role: 'Jefa de Sala & Pit Boss', venueId: 'casino', venueName: 'Casino', shift: '20:00 - 04:00', active: true },
  { id: 'st-2', name: 'Matías Lombardo', role: 'Técnico de Máquinas & Dosificación', venueId: 'laundry', venueName: 'Lavandería', shift: '18:00 - 02:00', active: true },
  { id: 'st-3', name: 'Santiago Vera', role: 'Head Bartender & Sommelier de Tabaco', venueId: 'skybar', venueName: 'Bar & Fumadores', shift: '20:00 - 04:00', active: true },
  { id: 'st-4', name: 'Lucía Benítez', role: 'Supervisora de Billeteros & Tesorería', venueId: 'casino', venueName: 'Casino', shift: '19:00 - 03:00', active: true },
  { id: 'st-5', name: 'Ramiro Cárdenas', role: 'Operador de Cabinas & Atención Express', venueId: 'laundry', venueName: 'Lavandería', shift: '22:00 - 06:00', active: true },
  { id: 'st-6', name: 'Camila Ordoñez', role: 'Especialista HVAC & Sala Fumadores', venueId: 'skybar', venueName: 'Bar & Fumadores', shift: '19:00 - 03:00', active: false },
];
