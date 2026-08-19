// Centraliza todas las llamadas al backend. Si el backend cambia de URL
// (por ejemplo al desplegarlo en un servidor real), solo se toca este archivo.

// OJO — MUY IMPORTANTE si probás en tu celular físico con Expo Go:
// "localhost" en el celular apunta al propio celular, no a tu PC.
// Reemplazá esto por la IP de tu computadora en la red local, por ejemplo:
//   const API_BASE_URL = 'http://192.168.0.15:4000/api/v1';
// La conseguís corriendo "ipconfig" en PowerShell y mirando "Dirección IPv4".
// Si estás probando con --web (en el navegador de la misma compu), localhost sí funciona.
const API_BASE_URL = 'http://localhost:4000/api/v1';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || 'Error de conexión con el servidor.');
    error.detalle = data.detalle;
    error.campos_faltantes = data.campos_faltantes;
    throw error;
  }

  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getProfesionales: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/profesionales${query ? `?${query}` : ''}`);
  },
  getProfesional: (id) => request(`/profesionales/${id}`),
  getMiPerfilProfesional: (token) => request('/perfil-profesional/mio', { token }),
  guardarMiPerfilProfesional: (payload, token) =>
    request('/perfil-profesional/mio', { method: 'PUT', body: payload, token }),
  crearChanga: (payload, token) =>
    request('/trabajos', { method: 'POST', body: payload, token }),
  getChangasDisponibles: (token) => request('/trabajos/disponibles', { token }),
  getMisChangasAsignadas: (token) => request('/trabajos/asignadas', { token }),
  aceptarChanga: (id, token) => request(`/trabajos/${id}/aceptar`, { method: 'PATCH', token }),
  getMensajes: (changaId, token) => request(`/chats/${changaId}/mensajes`, { token }),
  enviarMensaje: (changaId, texto, token) =>
    request(`/chats/${changaId}/mensajes`, { method: 'POST', body: { texto }, token }),
};
