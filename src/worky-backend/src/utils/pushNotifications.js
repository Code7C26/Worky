// Manda notificaciones push a través del servicio de Expo, que a su vez usa
// las credenciales de Firebase Cloud Messaging que subimos con "eas credentials".
// No hace falta el SDK de firebase-admin: un simple POST alcanza.

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * @param {string} expoPushToken - token guardado en Usuario.expoPushToken
 * @param {string} title
 * @param {string} body
 * @param {object} data - datos extra, ej. { changaId: '...' } para navegar al tocar la notificación
 */
async function enviarPush(expoPushToken, title, body, data = {}) {
  if (!expoPushToken) return; // el usuario no tiene la app instalada con permisos, no hacemos nada

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        to: expoPushToken,
        title,
        body,
        data,
        sound: 'default',
        priority: 'high',
      }),
    });

    const resultado = await res.json();
    if (resultado.data?.status === 'error') {
      console.error('⚠️ Error al mandar push:', resultado.data.message);
    }
  } catch (err) {
    // Un fallo al notificar no debería romper el flujo principal (ej. enviar el mensaje sí se guarda).
    console.error('⚠️ Error de red al mandar push:', err.message);
  }
}

module.exports = { enviarPush };
