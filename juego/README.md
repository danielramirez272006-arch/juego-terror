# Bucle de Terror (Horror Loop Game)

¡Bienvenido a **Bucle de Terror**, una experiencia inmersiva de point & click en el navegador! Estás atrapado en una casa que parece cambiar con el tiempo. El reloj sigue corriendo, tu cordura se agota y algo siniestro acecha en la oscuridad. ¿Lograrás escapar del bucle, o te convertirás en otra de sus víctimas?

## Mecánicas del Juego

1. **La Cordura (Sanity):** Tu nivel de cordura está en la parte superior derecha (el icono del cerebro). Si llega a 0, mueres. Los sustos (jumpscares), investigar áreas perturbadoras, el ruido, o quedarte en la oscuridad disminuirán tu cordura. 
2. **Exploración Point & Click:** Mueve tu ratón (el cursor es una cruz blanca). Las zonas en las que puedes hacer clic (hitboxes) están delimitadas con unos recuadros punteados blancos para que sepas dónde puedes interactuar. Hay diferentes tipos de interacciones:
   - *Mirar (Lupa):* Investigas notas, el espejo, o descubres secretos (¡a veces a costa de un susto!).
   - *Recoger (Mano):* Encuentras objetos importantes como llaves o armas.
   - *Moverse (Puerta):* Te trasladas de una habitación a otra.
3. **El Micrófono:** El juego tiene integración con tu micrófono real (opcional). En áreas como el Sótano, si detecta ruidos fuertes, el monstruo te encontrará y perderás muchísima cordura. ¡Mantente en absoluto silencio!
4. **Los Bucles:** Para escapar de la casa debes cruzar la Puerta Principal del Pasillo repetidas veces. Cada vez que la cruzas, la casa se vuelve más oscura, más perturbadora y el peligro aumenta. Tendrás que resolver puzzles y usar el entorno para sobrevivir.
5. **Clasificación (Leaderboard):** Al terminar la partida (ya sea que sobrevivas o mueras), tu nombre se registrará y podrás ver tu puntuación en un sistema CRT retro.

## Cómo Jugar

1. Introduce tu nombre en la pantalla principal y presiona "Iniciar Pesadilla".
2. Empiezas en el **Pasillo**. Frente a ti tienes la puerta principal, a la izquierda la Cocina, a la derecha el Baño, y más atrás el Sótano. Hacia arriba está la escotilla del Ático.
3. *Consejo:* Busca la Llave Oxidada en el Baño, la Llave del Ático en el microondas de la Cocina, y mantente callado en el Sótano si quieres reparar las luces.
4. Tu objetivo es encontrar el código secreto que está oculto (fíjate en el vapor del espejo del baño) para poder abrir el candado demoníaco del Bucle 5.
5. Usa los objetos (como el Cuchillo) para defenderte cuando las cosas se pongan tensas.

## Instalación y Desarrollo (Para Desarrolladores)

El juego utiliza React, Vite y un servidor JSON para las clasificaciones.

**Requisitos:**
- Node.js (v18+)

**Para ejecutar el juego localmente:**
1. Clona el repositorio.
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo y la base de datos de puntuaciones: `npm run dev` y `npx json-server --watch db.json --port 3000` (El juego y la API correrán de forma paralela, revisa `package.json`).
4. Abre `http://localhost:5173` en tu navegador.

¡Buena suerte, la vas a necesitar!
