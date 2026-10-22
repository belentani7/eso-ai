import Link from 'next/link';

export const metadata = {
  title: 'Privacidad | DANI',
  description: 'Cómo trata los datos el prototipo educativo DANI',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 text-slate-800 dark:text-slate-100">
      <Link href="/" className="underline text-sky-600 dark:text-sky-300">← Volver al inicio</Link>
      <h1 className="text-4xl font-bold mt-10 mb-6">Privacidad y uso responsable</h1>
      <p className="mb-5">DANI es un prototipo educativo con respuestas guiadas por reglas. Actualmente no ofrece cuentas personales ni un servicio de IA generativa conectado.</p>
      <h2 className="text-2xl font-semibold my-4">Mensajes y voz</h2>
      <p className="mb-5">La ruta de chat responde a cada solicitud y no guarda los mensajes en una base de datos. Evita introducir nombres completos, datos familiares, direcciones o información sensible. La voz depende de la compatibilidad del navegador y debe usarse solo con conocimiento de las condiciones de ese navegador.</p>
      <h2 className="text-2xl font-semibold my-4">Progreso</h2>
      <p className="mb-5">Las estadísticas de progreso mostradas por el servidor son <strong>de demostración</strong>: no se guardan los cambios enviados. No deben interpretarse como el expediente de ninguna persona.</p>
      <h2 className="text-2xl font-semibold my-4">Menores</h2>
      <p className="mb-5">La plataforma no solicita datos identificativos para practicar. Si la utiliza un menor, se recomienda supervisión de una persona adulta y no compartir datos personales en el chat.</p>
      <p className="text-sm opacity-75 mt-10">Información de funcionamiento del prototipo, actualizada en octubre de 2026. No sustituye a una política de privacidad específica de un servicio público con usuarios registrados.</p>
    </main>
  );
}
