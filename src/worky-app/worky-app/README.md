# Worky App — App Cliente (prototipo React Native)

Prototipo navegable de la app cliente de Worky, hecho con **Expo** (React Native), tal como está definido en el stack del proyecto.

## Pantallas incluidas

1. **Splash** — bienvenida. Los dos botones ahora llevan a Login, marcando si venís como cliente o profesional.
2. **Login** — inicio de sesión real contra el backend. Link abajo a "Crear cuenta".
3. **Register** — alta de cuenta real contra el backend. Guarda la sesión automáticamente al crearla.
4. **Home** — búsqueda y filtro de profesionales por categoría (todavía con datos de ejemplo, ver sección "Próximos pasos").
5. **Profile** — perfil del profesional (rating, experiencia, precio de referencia).
6. **CreateJob** — formulario para solicitar una changa (ubicación, categoría y precio ofrecido son obligatorios, igual que en el endpoint `POST /api/v1/trabajos`).
7. **Confirmation** — estado de la changa publicada.
8. **Chat** — mensajería con el profesional, ligada a la changa.

## ⚠️ Importante: conectar con el backend desde el celular

En `src/api/client.js` hay una constante `API_BASE_URL` apuntando a `http://localhost:4000`. Esto funciona si probás con `npx expo start --web` en la misma computadora donde corre el backend. **Pero si abrís la app en tu celular con Expo Go, `localhost` ahí apunta al celular, no a tu PC**, y el login/registro van a fallar con error de conexión.

Solución: conseguí la IP de tu compu en la red local (`ipconfig` en PowerShell → "Dirección IPv4", algo como `192.168.0.15`), y reemplazá esa línea en `client.js` por:
```js
const API_BASE_URL = 'http://192.168.0.15:4000/api/v1';
```
Tu celular y tu compu tienen que estar en la **misma red Wi-Fi** para que esto funcione.

## Cómo correrlo

Necesitás Node.js instalado. Después:

```bash
cd worky-app
npm install
npx expo start
```

Se abre el Metro Bundler. Desde ahí podés escanear el QR con la app **Expo Go** (Android/iOS) para verlo en tu celular, o presionar `a` / `i` en la terminal para abrir un emulador si lo tenés configurado.

## Estructura

```
worky-app/
├── App.js                  # navegación + carga de fuentes
├── src/
│   ├── theme/theme.js       # colores, tipografía, radios — todo el look sale de acá
│   ├── data/mockData.js     # datos de ejemplo (categorías, profesionales, mensajes)
│   ├── components/          # piezas reutilizables (botones, avatar, cards, chips)
│   └── screens/              # las 6 pantallas del flujo
```

## Próximos pasos sugeridos

- **Backend real**: reemplazar `src/data/mockData.js` por llamadas a la API (Express/MongoDB según el README del proyecto).
- **Chat**: conectar `ChatScreen.js` a Firestore/Realtime Database o WebSockets, y usar Firebase Cloud Messaging solo para la notificación push de "nuevo mensaje" cuando la app está en background.
- **Geolocalización**: integrar `expo-location` + Google Maps para reemplazar la ubicación fija del formulario y calcular distancias reales.
- **Pagos**: integrar Mercado Pago al confirmar una changa.
- **Modo oscuro**: el archivo `theme.js` está pensado para poder agregar un segundo set de colores y alternar con `useColorScheme()` de React Native sin tocar las pantallas.
- **App del profesional**: mismo patrón de carpetas, pantallas nuevas (recibir changas, aceptar/rechazar, agenda).
