export const categories = ['Todos', 'Plomería', 'Electricidad', 'Gas', 'Albañilería'];

export const professionals = [
  {
    id: 'rg-1',
    initials: 'RG',
    name: 'Roberto Giménez',
    oficio: 'Gasista matriculado',
    location: 'Alta Gracia',
    rating: 4.9,
    distanceKm: 2.3,
    availability: 'Disponible hoy',
    verified: true,
    jobsDone: 128,
    experienceYears: 6,
    priceRef: '$ 15.000 / visita',
    skills: ['Matrícula habilitante', 'Instalaciones de gas', 'Reparaciones'],
    about:
      'Gasista matriculado con más de 6 años de experiencia en instalaciones domiciliarias y reparaciones de urgencia en zona sur de Córdoba.',
  },
  {
    id: 'sl-2',
    initials: 'SL',
    name: 'Sofía López',
    oficio: 'Electricista',
    location: 'Alta Gracia',
    rating: 4.7,
    distanceKm: 3.1,
    availability: 'Disponible mañana',
    verified: true,
    jobsDone: 94,
    experienceYears: 4,
    priceRef: '$ 12.000 / visita',
    skills: ['Instalaciones domiciliarias', 'Tableros', 'Urgencias'],
    about:
      'Electricista con 4 años de experiencia en instalaciones residenciales y mantenimiento preventivo.',
  },
  {
    id: 'dp-3',
    initials: 'DP',
    name: 'Diego Paz',
    oficio: 'Plomero',
    location: 'Alta Gracia',
    rating: 4.8,
    distanceKm: 4.0,
    availability: 'Disponible hoy',
    verified: true,
    jobsDone: 156,
    experienceYears: 8,
    priceRef: '$ 10.000 / visita',
    skills: ['Destapaciones', 'Instalación de cañerías', 'Urgencias'],
    about:
      'Plomero con 8 años de trayectoria, especializado en destapaciones y reparaciones de urgencia.',
  },
];

export const chatMessages = [
  {
    id: 'm1',
    from: 'them',
    text: 'Hola Marcela, vi tu pedido. Puedo pasar hoy a las 17hs, ¿te queda bien?',
    time: '10:45',
  },
  {
    id: 'm2',
    from: 'me',
    text: 'Perfecto, te espero. Es en la cocina, pérdida cerca de la hornalla',
    time: '10:47',
  },
  {
    id: 'm3',
    from: 'them',
    text: 'Genial, llevo lo necesario. Cualquier cosa te aviso por acá si se demora algo',
    time: '10:48',
  },
];
