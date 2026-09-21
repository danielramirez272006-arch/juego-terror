// URL base de json-server local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/scores';

// URL del webhook de n8n para el registro final de partidas
const WEBHOOK_N8N_URL = import.meta.env.VITE_WEBHOOK_N8N_URL || 'http://localhost:5678/webhook-test/juego-terror-fin';
 

/**
 * Obtiene la tabla de puntajes desde la base de datos local
 */
export const getLeaderboard = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al cargar el leaderboard:', error);
    throw new Error('No se pudo conectar con el servidor local para obtener los puntajes.', { cause: error });
  }
};

/**
 * Guarda el puntaje final en la base de datos local (json-server)
 */
export const saveScore = async (scoreData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error al guardar el puntaje:', error);
    throw new Error('Fallo al guardar el resultado en la base de datos.', { cause: error });
  }
};

/**
 * Envía la información de la partida finalizada al webhook de n8n
 */
export const sendGameDataToWebhook = async (playerData) => {
  try {
    const response = await fetch(WEBHOOK_N8N_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });
    
    if (!response.ok) {
      console.warn('Webhook de n8n no respondió correctamente:', response.status);
    } else {
      console.log('Datos enviados a n8n exitosamente.');
    }
  } catch (error) {
    // Solo logueamos el error para que una falla en el webhook no rompa el flujo de la aplicación
    console.error('Fallo en la comunicación con el webhook de n8n:', error);
  }
};
