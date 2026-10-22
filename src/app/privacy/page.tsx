import Link from 'next/link';
export const metadata = { title: 'Privacidad | DANI', description: 'Funcionamiento y privacidad del prototipo educativo DANI' };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 text-slate-800 dark:text-slate-100">
      <Link href="/" className="underline text-sky-600 dark:text-sky-300">← Volver al inicio</Link>
      <h1 className="text-4xl font-bold mt-10 mb-6">Privacidad y uso responsable</h1>
      <p className="mb-5">DANI es un prototipo educativo con respuestas guiadas por reglas. Actualmente no ofrece cuentas ni un modelo de IA generativa conectado.</p>
      <h2 className="text-2xl font-semibold my-4">Chat y voz</h2>
      <p className="mb-5">El endpoint de chat no almacena mensajes en una base de datos. El navegador puede conservar preferencias y estado local; puedes borrarlos desde la configuración del dispositivo. Algunas funciones de voz dependen del navegador y sus permisos. No compartas direcciones, nombres completos o información sensible.</p>
      <h2 className="text-2xl font-semibold my-4">Progreso educativo</h2>
      <p className="mb-5">Los datos de progreso devueltos por la API son de demostración, no se guardan actualizaciones en un servidor y no deben interpretarse como resultados reales de un estudiante.</p>
      <h2 className="text-2xl font-semibold my-4">Menores</h2>
      <p className="mb-5">La herramienta es experimental y se recomienda supervisión adulta cuando la utilicen menores. No introduzcas datos identificativos de estudiantes.</p>
      <p className="text-sm opacity-75 mt-10">Descripción del prototipo, octubre de 2026. No es una política completa para un servicio con cuentas y usuarios reales.</p>
    </main>
  );
}
