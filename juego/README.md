# P.T. React - Escape del Bucle Infinito

Bienvenido a **P.T. React**, una experiencia de terror psicológico interactiva construida completamente en React, inspirada en el legendario *P.T. (Playable Teaser)*.

## 📖 Historia

Despiertas en un pasillo sombrío sin recordar cómo llegaste. Al cruzar la puerta del fondo, te das cuenta de que has vuelto al mismo pasillo... pero algo ha cambiado. Estás atrapado en un bucle espaciotemporal y una presencia demoníaca se alimenta de tu cordura. 

Para escapar, deberás explorar las habitaciones de la casa maldita, recoger objetos clave, resolver puzzles y, sobre todo, **cuidar tu cordura**. Si tu barra de cordura llega a 0, la locura te consumirá por completo.

## 🎮 Mecánicas del Juego

- **Bucle Infinito**: Avanzas de nivel (bucle) cruzando la puerta final del pasillo. Cada bucle nuevo corrompe más el ambiente y requiere que encuentres objetos clave para avanzar.
- **Cordura (Sanity System)**: Inicias con 100% de cordura. Si baja demasiado, empezarás a sufrir alucinaciones, la luz de tu linterna parpadeará y escucharás voces.
- **Inventario**: Recoge objetos clave interactuando con el entorno (ej. *Llave Oxidada*, *Llave del Ático*, *Cuchillo Ensangrentado*).
- **Puzzles**: Hay códigos ocultos en los espejos, puertas selladas y secretos en las paredes.
- **Jumpscares**: Mantente alerta. Si fuerzas la exploración de manera imprudente, los espíritus te atacarán y bajarán tu cordura.
- **Micrófono (Sótano)**: Si logras entrar al sótano (Bucle 4+), el juego utilizará el micrófono de tu computadora. Si haces ruido, el monstruo te atrapará.
- **Muerte y N8N**: Cuando mueres o ganas, el juego envía un informe de tu partida a un webhook de **n8n** (servidor local). Este flujo evalúa qué tan lejos llegaste y genera un Reporte de Defunción detallado.

## 🏗️ Habitaciones

1. **Pasillo (Hallway)**: El nexo principal. Aquí ocurren los eventos más extraños y está la puerta para avanzar de bucle.
2. **Baño (Bathroom)**: Un lugar terrorífico donde el espejo empañado oculta el código secreto para escapar.
3. **Cocina (Kitchen)**: Llena de electrodomésticos sangrientos. Cuidado con el microondas.
4. **Ático (Attic)**: Requiere llave. Está sumido en una oscuridad total. ¡Lleva un arma por si algo te ataca en la oscuridad!
5. **Sótano (Basement)**: El abismo. Aquí abajo, el ruido de la vida real te costará la vida en el juego.

## 🛠️ Tecnologías y Arquitectura

- **Frontend**: React (Vite).
- **Gestor de Estado**: Context API y Custom Hooks (`useGame.js`, `useInventory.js`, `useAudioEngine.js`, `useSpeech.js`).
- **Diseño**: CSS Puro (`index.css`) con variables, animaciones keyframe (glitch, CRT, aberración cromática) y "Glassmorphism" para una estética premium y responsiva.
- **Sonido Diegético**: `Web Audio API` y síntesis de voz (`SpeechSynthesis`).
- **Persistencia**: `json-server` simula una API REST local (`db.json`) para guardar y cargar los mejores puntajes en el *Muro de los Lamentos*.
- **Integración N8N**: Webhooks conectados a n8n para analítica de los finales.

## 🚀 Instalación y Ejecución

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Crea un archivo `.env` en la raíz (junto a `package.json`) y agrega la ruta de tu webhook de n8n:
   ```env
   VITE_API_URL=http://localhost:3000/scores
   VITE_WEBHOOK_N8N_URL=http://localhost:5678/webhook-test/juego-terror-fin
   ```
4. Abre **dos terminales**.
5. En la primera terminal, inicia la base de datos de puntajes:
   ```bash
   npx json-server --watch db.json --port 3000
   ```
6. En la segunda terminal, inicia el juego en modo desarrollo:
   ```bash
   npm run dev
   ```
7. Abre el enlace local en tu navegador (por defecto `http://localhost:5173/`).

## ⚠️ Advertencia
Este juego contiene sonidos fuertes, imágenes perturbadoras y destellos de luz. Jugar en una habitación oscura con auriculares bajo su propio riesgo.
