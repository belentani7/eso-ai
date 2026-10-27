/**
 * Read a request body with a hard byte limit before parsing JSON.
 * Reading Request.text() first would allow arbitrarily large allocations.
 */
export class RequestTooLargeError extends Error {
  constructor() {
    super('Solicitud demasiado grande');
    this.name = 'RequestTooLargeError';
  }
}

export class InvalidRequestEncodingError extends Error {
  constructor() {
    super('El cuerpo debe ser texto UTF-8 válido');
    this.name = 'InvalidRequestEncodingError';
  }
}

export async function readBoundedRequestText(request, maxBytes = 16384) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new RangeError('El límite debe ser un entero positivo');
  }

  const declaredLength = request.headers?.get('content-length');
  if (declaredLength && /^\d+$/.test(declaredLength) && Number(declaredLength) > maxBytes) {
    await request.body?.cancel().catch(() => {});
    throw new RequestTooLargeError();
  }

  if (!request.body) return '';

  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytesRead = 0;
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!(value instanceof Uint8Array)) {
        throw new TypeError('El cuerpo debe contener bytes');
      }
      bytesRead += value.byteLength;
      if (bytesRead > maxBytes) throw new RequestTooLargeError();
      try {
        text += decoder.decode(value, { stream: true });
      } catch {
        throw new InvalidRequestEncodingError();
      }
    }
    try {
      text += decoder.decode();
    } catch {
      throw new InvalidRequestEncodingError();
    }
    return text;
  } catch (error) {
    // Stop reading immediately after an oversized or malformed request.
    try { await reader.cancel(); } catch { /* stream may already be closed */ }
    throw error;
  } finally {
    reader.releaseLock();
  }
}
