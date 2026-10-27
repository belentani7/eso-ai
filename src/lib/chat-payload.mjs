/**
 * Privacy-first request contract for rule-based DANI tutor.
 * This is NOT an LLM gateway: reject oversized/untrusted chat histories.
 */
export function parseChatPayload(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new TypeError('El cuerpo debe ser un objeto JSON');
  }
  const message = raw.message;
  if (typeof message !== 'string' || !message.trim() || message.length > 2000) {
    throw new TypeError('Mensaje requerido (máximo 2000 caracteres)');
  }
  const language = raw.language ?? 'es';
  if (!['es', 'ca', 'pt', 'en'].includes(language)) {
    throw new TypeError('Idioma no compatible');
  }
  const history = raw.history ?? [];
  if (!Array.isArray(history) || history.length > 20 ||
      history.some(item => !item || typeof item !== 'object' ||
        Array.isArray(item) || typeof item.content !== 'string' ||
        item.content.length > 2000 ||
        !['user','assistant'].includes(item.role))) {
    throw new TypeError('Historial inválido (máximo 20 mensajes)');
  }
  return {
    message: message.trim(),
    language,
    history: history.map(item => ({role: item.role, content: item.content})),
  };
}
