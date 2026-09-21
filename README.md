# 🕯️ Escape del Bucle (The Endless Corridor) - Horror Game

Una experiencia inmersiva de terror psicológico y *point & click* en primera persona construida con **React**, inspirada en la atmósfera opresiva y los bucles temporales de *P.T. (Silent Hills)*.

---

## 📖 Descripción del Juego

En **Escape del Bucle**, despiertas atrapado en una casa abandonada en un ciclo temporal infinito. Cada vez que cruzas la puerta del pasillo, el entorno se deteriora, los sonidos se distorsionan y tu salud mental decae. Tu objetivo es encontrar pistas en las diferentes habitaciones, recolectar llaves y objetos, descifrar el código oculto y abrir el candado demoníaco final para escapar.

### 🎮 Mecánicas Principales

1. **🧠 Sistema de Cordura (Sanity Meter):**
   - Inicias con 100% de cordura.
   - La cordura disminuye al interactuar con horrores, recibir sustos (*jumpscares*), permanecer en el ático o en la oscuridad.
   - Si la cordura llega a 0%, sufres una muerte psicológica inmediata.
   - **Efectos dinámicos:** Distorsión visual, aberración cromática, palpitaciones cardíacas y una pantalla azul de la muerte (BSOD) diegética si estás al borde de la locura.

2. **🔦 Linterna y Visión Focal:**
   - La pantalla está sumergida en oscuridad total excepto por el haz de luz dinámico de tu linterna, el cual sigue la posición exacta del cursor en tiempo real mediante *radial gradients*.

3. **🎙️ Detección de Ruido por Micrófono (Web Audio API):**
   - Al bajar al **Sótano**, el micrófono se activa. Si hablas o haces un ruido fuerte en la vida real, el monstruo te escucha y te ataca de inmediato.

4. **📷 Jumpscares Personalizados (Webcam / MediaDevices):**
   - Con el permiso del jugador, el juego captura una instantánea que se utiliza dinámicamente en los sustos más violentos.

5. **🎒 Inventario e Interacciones Point & Click:**
   - Zonas interactivas transparentes e inmersivas con tooltips flotantes temáticos.
   - Búsqueda de llaves (*Llave Oxidada*, *Llave del Ático*), armas de defensa (*Cuchillo Ensangrentado*) y notas de lore.

6. **🏆 Muro de los Lamentos (Tabla de Clasificación):**
   - Sistema de puntuaciones persistente conectado a una API REST local (`json-server`) con ordenamiento inmutable por nivel y tiempo.

7. **⚡ Automatización con n8n:**
   - Envío de webhooks automáticos al finalizar cada partida con los resultados del jugador para análisis o notificaciones.

---

## 🛠️ Tecnologías Usadas

- **Frontend Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Enrutamiento:** [React Router DOM v6](https://reactrouter.com/) (Lazy loading + Suspense + Error Boundaries)
- **Estilos & Efectos:** Vanilla CSS (Glassmorphism, CRT scanline shader, animaciones de glitch, tipografías Google Fonts *Cinzel Decorative* y *VT323*)
- **APIs del Navegador:**
  - `Web Audio API` (Análisis de frecuencia y volumen en tiempo real)
  - `Web Speech API / SpeechSynthesis` (Voz sintetizada y efectos narrativos)
  - `MediaDevices API` (Cámara web para jumpscares)
- **Persistencia de Datos:** [JSON Server](https://github.com/typicode/json-server) (`db.json`)
- **Automatización de Flujos:** [n8n](https://n8n.io/) (Webhook POST + Evaluación condicional IF)

---

## 🔗 Configuración del Webhook de n8n

El juego emite automáticamente un `HTTP POST` al terminar la partida (victoria o muerte) con la estructura:
```json
{
  "nombre": "Mauricio",
  "nivel": 5,
  "tiempo": 142,
  "cordura": 68,
  "victoria": true,
  "fecha": "2026-09-21T23:15:00.000Z"
}
```

* **URL del Webhook (Entorno Local / Pruebas):**
  ```text
  http://localhost:5678/webhook-test/juego-terror-fin
  ```
* **Variable de Entorno (`.env`):**
  ```env
  VITE_API_URL=http://localhost:3000/scores
  VITE_WEBHOOK_N8N_URL=http://localhost:5678/webhook-test/juego-terror-fin
  ```

---

## 🚀 Instrucciones para Ejecutar el Proyecto

### 1. Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [npm](https://www.npmjs.com/)

### 2. Instalación de Dependencias
Abre una terminal en la carpeta del proyecto e instala los módulos:
```bash
cd juego
npm install
```

### 3. Iniciar el Servidor de Datos (`json-server`)
En una terminal ejecuta el servidor de puntuaciones en el puerto 3000:
```bash
npx json-server --watch db.json --port 3000
```

### 4. Iniciar el Servidor de Desarrollo (`Vite`)
En otra terminal dentro de la carpeta `juego/` ejecuta:
```bash
npm run dev
```

### 5. Abrir en el Navegador
Abre tu navegador e ingresa a:
```text
http://localhost:5173
```
