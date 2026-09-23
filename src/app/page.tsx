import Link from 'next/link';
import { Brain, Mic, Gamepad2, BookOpen, Music, Globe, Sparkles, ArrowRight, Shield, Heart, Star, Zap } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Mic,
      title: 'Conversación por Voz',
      description: 'Habla con DANI en español, catalán, portugués o inglés. Reconocimiento de voz y respuesta hablada natural.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Brain,
      title: 'Aprendizaje Adaptativo',
      description: 'IA que se adapta a tu nivel, detecta falsos amigos y usa tu portugués como puente para aprender más rápido.',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: Gamepad2,
      title: 'Juegos Educativos',
      description: 'Caza-Falsos-Amigos, Mate-Escape, Trilingüe Express, Catalán Challenge y Super Quiz Integral.',
      color: 'from-accent-500 to-accent-600',
    },
    {
      icon: BookOpen,
      title: 'Currículo ESO Completo',
      description: 'Matemáticas, Ciencias, Geografía e Historia alineados con Decret 175/2022 (Cataluña) para 2º/3º ESO.',
      color: 'from-success-500 to-success-600',
    },
    {
      icon: Globe,
      title: 'Puente Cultural Brasil-España',
      description: 'Conecta tu historia con la española: Tratado de Tordesillas, familia real portuguesa, música compartida.',
      color: 'from-warning-500 to-warning-600',
    },
    {
      icon: Music,
      title: 'Música para Aprender',
      description: 'Canciones en 4 idiomas, análisis de letras, ritmo para memorizar vocabulario y cultura musical.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const stats = [
    { value: '4', label: 'Idiomas', icon: Globe },
    { value: '5', label: 'Juegos', icon: Gamepad2 },
    { value: '50+', label: 'Lecciones', icon: BookOpen },
    { value: '∞', label: 'Práctica', icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-display text-xl font-bold gradient-text">DANI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Características</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</Link>
              <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonios</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/chat" className="btn-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Empezar Ahora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100/50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-800/50 mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">Nueva versión 2.0 - Voz natural multilingüe</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-display font-bold tracking-tight mb-6 animate-slide-up">
              Tu <span className="gradient-text">Amigo de Estudio</span> con IA
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Diseñado para William: brasileño de 14 años en España. Aprende español, catalán, inglés, matemáticas, cultura y música con una IA que te entiende.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link href="/dashboard/chat" className="btn-primary text-lg px-10 py-4 group">
                <Sparkles className="w-5 h-5 mr-2" />
                Habla con DANI
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/dashboard/games" className="btn-outline text-lg px-10 py-4">
                <Gamepad2 className="w-5 h-5 mr-2" />
                Jugar y Aprender
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success-500" />
                <span>Privacidad primero</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent-500" />
                <span>Diseñado con empatía</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning-500" />
                <span>Basado en ciencia</span>
              </div>
            </div>
          </div>

          {/* Animated illustration */}
          <div className="relative mt-16 animate-float">
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video rounded-3xl bg-gradient-to-br from-primary-100/50 via-white to-secondary-100/50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/50 border border-border/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
                <div className="relative z-10 text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center animate-pulse-soft">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">"Hola William, ¿en qué te ayudo hoy?"</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    DANI te escucha, te responde con voz natural y te guía paso a paso en tu aprendizaje.
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-10 h-10 rounded-full bg-green-500 border-4 border-background flex items-center justify-center text-white text-xs font-bold">PT</div>
                      <div className="w-10 h-10 rounded-full bg-red-500 border-4 border-background flex items-center justify-center text-white text-xs font-bold">ES</div>
                      <div className="w-10 h-10 rounded-full bg-yellow-500 border-4 border-background flex items-center justify-center text-white text-xs font-bold">CA</div>
                      <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-background flex items-center justify-center text-white text-xs font-bold">EN</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 gradient-text" />
                </div>
                <div className="text-4xl sm:text-5xl font-display font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">Todo lo que necesitas para <span className="gradient-text">triunfar</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Una plataforma completa diseñada específicamente para adolescentes migrantes que aprenden múltiples idiomas simultáneamente.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={feature.title} className="card group animate-on-scroll" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br {feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">Cómo funciona en <span className="gradient-text">3 pasos</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Simple, efectivo y diseñado para que William avance a su ritmo.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Configura tu perfil', description: 'DANI evalúa tu nivel en 10 minutos con un test diagnóstico divertido. Detecta tu nivel real en mates, vocabulario y idiomas.' },
              { step: '02', title: 'Habla y juega', description: 'Conversa por voz con DANI, juega partidas educativas, resuelve retos matemáticos y descubre cultura. Todo adaptado a ti.' },
              { step: '03', title: 'Progresa y celebra', description: 'Gana puntos, desbloquea logros, ve tu progreso en gráficos y comparte tus logros. La IA ajusta la dificultad automáticamente.' },
            ].map((item, index) => (
              <div key={item.step} className="relative card text-center animate-on-scroll" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="text-5xl font-display font-bold text-primary-100 dark:text-primary-900/30 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-4">Currículo <span className="gradient-text">Integral</span></h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Alineado con el currículo oficial de Cataluña (Decret 175/2022) para 2º/3º ESO.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: 'Español (L2)', topics: ['Falsos amigos', 'Fonética contrastiva', 'Gramática', 'Vocabulario escolar'], color: 'from-primary-500 to-primary-600' },
              { icon: Globe, title: 'Catalán (L3)', topics: ['Parla.cat A1-A2', 'Ventajas fonéticas PT-CA', 'Vocabulario instituto', 'Inmersión diaria'], color: 'from-secondary-500 to-secondary-600' },
              { icon: Globe, title: 'Inglés (L4)', topics: ['A2 → B1', 'Transferencia metalingüística', 'BBC Learning English', 'Vocabulario científico'], color: 'from-accent-500 to-accent-600' },
              { icon: Brain, title: 'Matemáticas', topics: ['Ecuaciones 1º/2º grado', 'Geometría + GeoGebra', 'Porcentajes', 'Estadística básica'], color: 'from-success-500 to-success-600' },
              { icon: Brain, title: 'Ciencias', topics: ['Biología: célula', 'Física: energía', 'Química: átomo', 'Vocabulario internacional'], color: 'from-purple-500 to-purple-600' },
              { icon: Globe, title: 'Geo/Historia', topics: ['España + Cataluña', 'Conexiones Brasil', 'Líneas de tiempo', 'Mapas interactivos'], color: 'from-warning-500 to-warning-600' },
              { icon: Music, title: 'Música', topics: ['Canciones 4 idiomas', 'Análisis de letras', 'Ritmo y memoria', 'Cultura musical'], color: 'from-pink-500 to-pink-600' },
              { icon: Zap, title: 'Gamificación', topics: ['5 juegos educativos', 'Puntos y rachas', 'Logros desbloqueables', 'Progreso visual'], color: 'from-cyan-500 to-cyan-600' },
            ].map((subject, index) => (
              <div key={subject.title} className="card group animate-on-scroll" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br {subject.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <subject.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-3">{subject.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {subject.topics.map((topic) => (
                    <li key={topic} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">¿Listo para que William empiece hoy?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Configura DANI en 5 minutos. Sin instalaciones complejas, funciona en el navegador. William solo necesita un micrófono y ganas de aprender.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard/chat" className="btn-primary text-lg px-10 py-4 bg-white text-primary-600 hover:bg-primary-50 shadow-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Empezar Gratis
                </Link>
                <Link href="/dashboard/games" className="btn-outline text-lg px-10 py-4 border-white text-white hover:bg-white/10">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Ver Juegos
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">No requiere tarjeta de crédito · Cancela cuando quieras · Datos en tu dispositivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="font-display text-xl font-bold gradient-text">DANI</span>
              </div>
              <p className="text-muted-foreground text-sm">IA educativa diseñada con empatía para adolescentes migrantes. Basada en investigación pedagógica y lingüística contrastiva.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard/chat" className="hover:text-foreground transition-colors">Chat por Voz</Link></li>
                <li><Link href="/dashboard/games" className="hover:text-foreground transition-colors">Juegos</Link></li>
                <li><Link href="/dashboard/curriculum" className="hover:text-foreground transition-colors">Currículo</Link></li>
                <li><Link href="/dashboard/progress" className="hover:text-foreground transition-colors">Progreso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Idiomas</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Español (L2)</li>
                <li>Catalán (L3)</li>
                <li>Inglés (L4)</li>
                <li>Portugués (Apoyo)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://parla.cat" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Parla.cat</a></li>
                <li><a href="https://khanacademy.org" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">Khan Academy</a></li>
                <li><a href="https://geogebra.org" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">GeoGebra</a></li>
                <li><a href="https://elevenlabs.io" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">ElevenLabs</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Belentani Labs. Creado para William y todos los adolescentes que aprenden nuevos mundos.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacidad</a>
              <a href="#" className="hover:text-foreground transition-colors">Términos</a>
              <a href="#" className="hover:text-foreground transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}