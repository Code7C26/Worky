# Worky Backend

API en Node.js + Express + MongoDB (Atlas), tal como está definido en el stack del proyecto.

## Endpoints incluidos

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Crea un usuario (cliente o profesional) |
| POST | `/api/v1/auth/login` | No | Devuelve un token de sesión (JWT) |
| GET | `/api/v1/profesionales` | No | Lista profesionales, con filtro por categoría y ubicación |
| GET | `/api/v1/profesionales/:id` | No | Perfil de un profesional |
| POST | `/api/v1/trabajos` | Sí | Crea una changa (ubicación, categoría y precio ofrecido obligatorios) |
| GET | `/api/v1/trabajos/mias` | Sí | Changas publicadas por el usuario logueado |
| GET | `/api/v1/trabajos/:id` | Sí | Detalle de una changa |
| GET | `/api/v1/chats/:changaId/mensajes` | Sí | Historial de chat de una changa |
| POST | `/api/v1/chats/:changaId/mensajes` | Sí | Envía un mensaje |

Las rutas "protegidas" necesitan el header `Authorization: Bearer <token>`, con el token que devuelve el login.

## Cómo levantarlo

**1.** Necesitás Node.js instalado (igual que para el frontend).

**2.** Instalá las dependencias:
```bash
cd worky-backend
npm install
```

**3.** Creá tu archivo de variables de entorno a partir de la plantilla:
```bash
cp .env.example .env
```
(en Windows PowerShell: `copy .env.example .env`)

**4.** Abrí `.env` y completá:
- `MONGODB_URI`: el connection string que te dio Atlas, agregando `/worky` antes del `?`.
  Ejemplo: `mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/worky?retryWrites=true&w=majority`
- `JWT_SECRET`: cualquier texto largo random (por ejemplo, generalo en https://randomkeygen.com, usá uno de la sección "CodeIgniter Encryption Keys").

**5.** Corré el servidor:
```bash
npm run dev
```
Si ves `✅ Conectado a MongoDB Atlas` y `🚀 Worky backend corriendo en http://localhost:4000`, está todo funcionando.

**6.** Probalo abriendo `http://localhost:4000` en el navegador — debería devolver `{"status":"ok","app":"Worky backend"}`.

## Probar los endpoints

Recomiendo instalar **Postman** o **Thunder Client** (extensión de VS Code) para probar los endpoints sin tener que conectar el frontend todavía. Por ejemplo, para registrar un usuario:

```
POST http://localhost:4000/api/v1/auth/register
Body (JSON):
{
  "nombre": "Roberto Giménez",
  "email": "roberto@ejemplo.com",
  "password": "123456",
  "rol": "profesional"
}
```

Te devuelve un `token` — copialo y usalo en el header `Authorization: Bearer <token>` para probar las rutas protegidas, como crear una changa.

## Qué falta conectar (próximos pasos)

- **Frontend**: reemplazar `src/data/mockData.js` de la app en React Native por llamadas `fetch`/`axios` a estos endpoints.
- **Perfiles profesionales**: falta el endpoint para que un profesional cargue/edite su `PerfilProfesional` (matrícula, skills, precio). Lo armamos cuando encaremos la app del profesional.
- **Google Maps**: hoy `ubicacion` se guarda como texto libre; falta integrar geocoding real para convertir dirección → coordenadas.
- **Mercado Pago**: falta el endpoint de pago al confirmar/finalizar una changa.
- **Firebase Cloud Messaging**: dejé comentarios en el código (`changasController.js`, `mensajesController.js`) marcando exactamente dónde enganchar las notificaciones push.
