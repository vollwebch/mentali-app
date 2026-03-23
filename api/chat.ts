import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Message {
  role: string;
  content: string;
}

// Simulated intelligent responses
function getSimulatedResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Greeting responses
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días') || lowerMessage.includes('buenas')) {
    return '¡Hola! 🌱 Es un placer saludarte. Soy Mentali, tu espacio de reflexión y apoyo emocional. ¿Cómo te sientes hoy? Estoy aquí para escucharte sin juicios.';
  }

  // Emotional support
  if (lowerMessage.includes('triste') || lowerMessage.includes('deprimido') || lowerMessage.includes('mal')) {
    return 'Siento que estés pasando por un momento difícil. 🤗 Tus emociones son válidas y es completamente normal sentirse así a veces. ¿Te gustaría hablar sobre qué está pasando? A veces, poner en palabras lo que sentimos nos ayuda a procesarlo mejor.';
  }

  // Anxiety
  if (lowerMessage.includes('ansiedad') || lowerMessage.includes('nervioso') || lowerMessage.includes('preocupado')) {
    return 'La ansiedad puede ser muy abrumadora, pero recuerda que es temporal. 🌿 Te sugiero probar respiraciones profundas: inhala 4 segundos, mantén 4 segundos, exhala 6 segundos. ¿Hay algo específico que te esté preocupando ahora mismo?';
  }

  // Stress
  if (lowerMessage.includes('estrés') || lowerMessage.includes('estresado') || lowerMessage.includes('agobiado')) {
    return 'El estrés es una señal de que algo en tu vida necesita atención. 💪 Identificar qué te genera estrés es el primer paso. ¿Puedes identificar qué situación está contribuyendo más a este estrés? A veces dividir los problemas en partes más pequeñas ayuda.';
  }

  // Happy
  if (lowerMessage.includes('feliz') || lowerMessage.includes('bien') || lowerMessage.includes('genial')) {
    return '¡Me alegra mucho saber que te sientes bien! ✨ Es importante celebrar estos momentos positivos. ¿Qué ha contribuido a que te sientas así hoy? Reconocer lo que nos hace bien nos ayuda a cultivar más de eso.';
  }

  // Sleep issues
  if (lowerMessage.includes('dormir') || lowerMessage.includes('insomnio') || lowerMessage.includes('noche')) {
    return 'Los problemas de sueño pueden afectar mucho nuestro bienestar. 😴 Algunas sugerencias: mantener horarios regulares, evitar pantallas antes de dormir, y crear un ambiente relajante en tu habitación. ¿Hace cuánto tiempo tienes dificultades para dormir?';
  }

  // Work related
  if (lowerMessage.includes('trabajo') || lowerMessage.includes('jefe') || lowerMessage.includes('compañeros')) {
    return 'El ambiente laboral puede ser una fuente importante de estrés. 🏢 Es importante establecer límites saludables y encontrar maneras de desconectar fuera del horario laboral. ¿Qué aspecto del trabajo te está afectando más?';
  }

  // Relationship
  if (lowerMessage.includes('pareja') || lowerMessage.includes('relación') || lowerMessage.includes('novio') || lowerMessage.includes('novia')) {
    return 'Las relaciones pueden ser tanto fuente de alegría como de desafíos. 💕 Es importante comunicarse de forma asertiva y escuchar activamente. ¿Hay algo específico en tu relación que te gustaría explorar?';
  }

  // Family
  if (lowerMessage.includes('familia') || lowerMessage.includes('padres') || lowerMessage.includes('hijos')) {
    return 'Las dinámicas familiares pueden ser complejas. 👨‍👩‍👧‍👦 Cada familia tiene sus propios patrones y desafíos. ¿Te gustaría hablar más sobre qué está pasando en tu entorno familiar?';
  }

  // Help seeking
  if (lowerMessage.includes('ayuda') || lowerMessage.includes('necesito')) {
    return 'Pedir ayuda es un acto de valentía y autoconocimiento. 🌟 Estoy aquí para escucharte. Cuéntame más sobre lo que estás experimentando y juntos podemos explorar opciones.';
  }

  // Gratitude
  if (lowerMessage.includes('gracias') || lowerMessage.includes('agradezco')) {
    return '¡Gracias a ti por confiar en mí! 🙏 Es un honor poder acompañarte en tu proceso de reflexión. Si en algún momento necesitas hablar, estaré aquí. ¿Hay algo más en lo que pueda ayudarte?';
  }

  // Default thoughtful response
  const thoughtfulResponses = [
    'Te escucho con atención. 💭 A veces, simplemente expresar lo que sentimos nos ayuda a clarificar nuestros pensamientos. ¿Podrías contarme más sobre cómo esto te hace sentir?',
    'Gracias por compartir eso conmigo. 🌱 Cada experiencia que compartes me ayuda a entenderte mejor. ¿Qué crees que sería más útil para ti en este momento?',
    'Es importante lo que me cuentas. 💫 Reflexionar sobre nuestras experiencias es una forma de cuidarnos. ¿Has identificado algún patrón en cómo reaccionas ante situaciones similares?',
    'Aprecio tu confianza al compartir esto. 🤝 ¿Hay algo específico que te gustaría explorar o entender mejor sobre esta situación?'
  ];

  return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      message: 'Mentali AI Chat API está funcionando',
      version: '2.0.0'
    });
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: 'Se requiere un array de mensajes' });
        return;
      }

      // Get the last user message
      const lastMessage = messages.filter((m: Message) => m.role === 'user').pop();

      if (!lastMessage) {
        res.status(400).json({ error: 'No se encontró mensaje del usuario' });
        return;
      }

      // Generate intelligent response
      const response = getSimulatedResponse(lastMessage.content);

      res.status(200).json({ response });
    } catch (error: any) {
      console.error('Error in chat API:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
    return;
  }

  // Method not allowed
  res.status(405).json({ error: 'Método no permitido' });
}
