// Convierte un PerfilProfesional (con "usuario" populado) que devuelve el backend
// al mismo formato plano que antes usaban las pantallas con datos de mockData.js.
// Así evitamos reescribir todos los componentes visuales.

export function getIniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/);
  const primeras = partes.slice(0, 2).map((p) => p[0]?.toUpperCase() || '');
  return primeras.join('') || '??';
}

export function mapPerfilAPro(perfil) {
  if (!perfil) return null;

  return {
    id: perfil._id,
    initials: getIniciales(perfil.usuario?.nombre),
    name: perfil.usuario?.nombre || 'Profesional',
    oficio: perfil.oficio,
    categoria: perfil.categoria,
    location: perfil.usuario?.ubicacion?.direccionTexto || '',
    rating: perfil.rating || 0,
    distanceKm: null, // falta integrar geolocalización real (expo-location + Google Maps)
    availability: perfil.disponible ? 'Disponible' : 'No disponible por ahora',
    verified: !!perfil.verificado,
    jobsDone: perfil.cantidadChangas || 0,
    experienceYears: perfil.experienciaAnios || 0,
    priceRef: perfil.precioReferencia ? `$ ${perfil.precioReferencia.toLocaleString('es-AR')} / visita` : 'A convenir',
    skills: perfil.skills || [],
    about: perfil.about || '',
  };
}
