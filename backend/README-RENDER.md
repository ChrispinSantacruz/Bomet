Despliegue en Render — backend (index.js)

Resumen rápido
- `index.js` ahora espera a que MongoDB se conecte antes de arrancar el servidor.
- Está enlazado a `0.0.0.0` y usa `process.env.PORT` — esto es compatible con Render.
- Se añadió una ruta de healthcheck en `/healthz` para que Render pueda comprobar el estado.

Pasos para desplegar en Render (dashboard web)
1. Entra a https://dashboard.render.com y crea un nuevo "Web Service".
2. En "Connect a repo" elige tu repositorio (o pega la URL si usas `render.yaml`).
3. En "Root Directory" pon `backend` (opcional si vas a usar `render.yaml`).
4. Build Command:  cd backend; npm install
5. Start Command:  cd backend; npm start
6. Environment: set the following env vars in the Render service settings (Environment > Environment Variables):
   - MONGODB_URI = (tu connection string de MongoDB Atlas)
   - ADMIN_KEY = (opcional, si quieres poder borrar el leaderboard)
   Render proporciona automáticamente `PORT` al contenedor; no es necesario fijarlo.
7. Health check path: /healthz
8. Deploy.

Notas importantes
- No subas tu MONGODB_URI con credenciales a este repositorio. Usa las Environment Variables del dashboard.
- Si la conexión a Mongo falla, el proceso sale con código 1 para que Render lo marque como fallo y aplique reintentos.

Verificación rápida (una vez desplegado)
- Abre la URL que Render te asigna y revisa `https://<tu-servicio>.onrender.com/healthz` — debe devolver JSON con { ok: true }
- Probar endpoint POST (PowerShell example):

```powershell
$body = @{ playerName = 'RenderTest'; score = 1234 } | ConvertTo-Json
Invoke-RestMethod -Uri 'https://<tu-servicio>.onrender.com/api/scores' -Method Post -ContentType 'application/json' -Body $body
Invoke-RestMethod -Uri 'https://<tu-servicio>.onrender.com/api/leaderboard?limit=5' -Method Get
```

Problemas comunes
- Error: "Failed to start server — MongoDB connection error": revisa que `MONGODB_URI` esté bien y que la IP de Render no esté bloqueada en Atlas (en Atlas, under Network Access, add 0.0.0.0/0 or appropriate CIDR).
- Si el servicio entra en crash loop: abre los logs en Render para ver la traza (consola muestra el error de conexión a Mongo).

Si quieres, puedo crear el `render.yaml` final con variables secretas omitidas o ayudarte a rellenarlo desde aquí si me das la URL del repo en Render y confirmas que quieres que agregue un `render.yaml` listo para usar.
