import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, LANGUAGES, FALSE_FRIENDS, MATH_VOCABULARY, CATALAN_ADVANTAGES } from '@/data';

export async function POST(request: NextRequest) {
  try {
    const { message, language = 'es', history = [], userProfile } = await request.json();
    
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
    }

    // In production, this would call OpenAI/Claude API
    // For now, we simulate an intelligent response
    const response = generateAIResponse(message, language, history);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

function generateAIResponse(userMessage: string, language: string, history: any[]) {
  const lower = userMessage.toLowerCase();
  const langInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[1];
  
  // Math detection
  if (lower.includes('ecuación') || lower.includes('resuelve') || lower.match(/\d+x\s*[+-]/) || lower.includes('matemática') || lower.includes('mate')) {
    return generateMathResponse(userMessage, language);
  }
  
  // False friend detection
  const ff = FALSE_FRIENDS.find(f => 
    lower.includes(f.pt.toLowerCase()) || 
    lower.includes(f.esWrong.toLowerCase()) ||
    lower.includes(f.esCorrect.toLowerCase())
  );
  if (ff) {
    return generateFalseFriendResponse(ff, language);
  }
  
  // Language practice
  if (lower.includes('catalán') || lower.includes('català') || lower.includes('catalan')) {
    return generateCatalanResponse(language);
  }
  
  if (lower.includes('inglés') || lower.includes('english') || lower.includes('ingles')) {
    return generateEnglishResponse(language);
  }
  
  // Greeting
  if (lower.includes('hola') || lower.includes('oi') || lower.includes('hello') || lower.includes('buenos') || lower.includes('bon dia') || history.length === 0) {
    return generateGreetingResponse(language);
  }
  
  // Default supportive response
  return generateDefaultResponse(language);
}

function generateMathResponse(message: string, language: string) {
  const vocab = [
    { concept: 'Ecuación', pt: 'Equação', es: 'Ecuación', ca: 'Equació', en: 'Equation', category: 'Álgebra' },
    { concept: 'Despejar', pt: 'Isolar', es: 'Despejar', ca: 'Aïllar', en: 'Isolate', category: 'Álgebra' },
    { concept: 'Incógnita', pt: 'Incógnita', es: 'Incógnita', ca: 'Incògnita', en: 'Unknown', category: 'Álgebra' },
  ];
  
  // Check for specific equation
  const eqMatch = message.match(/(\d*)\s*x\s*([+-])\s*(\d+)\s*=\s*(\d+)/);
  if (eqMatch) {
    const [, a, op, b, c] = eqMatch;
    const aNum = a ? parseInt(a) : 1;
    const bNum = parseInt(b);
    const cNum = parseInt(c);
    
    let solution: number;
    let steps: string[];
    
    if (op === '+') {
      solution = (cNum - bNum) / aNum;
      steps = [
        `Tenemos ${aNum}x + ${bNum} = ${cNum}`,
        `Paso 1: Restamos ${bNum} a ambos lados → ${aNum}x = ${cNum - bNum}`,
        `Paso 2: Dividimos por ${aNum} → x = ${solution}`,
      ];
    } else {
      solution = (cNum + bNum) / aNum;
      steps = [
        `Tenemos ${aNum}x - ${bNum} = ${cNum}`,
        `Paso 1: Sumamos ${bNum} a ambos lados → ${aNum}x = ${cNum + bNum}`,
        `Paso 2: Dividimos por ${aNum} → x = ${solution}`,
      ];
    }
    
    return {
      text: `¡Vamos a resolverla paso a paso! 🧠\n\n${steps.join('\n')}\n\n✅ **Solución: x = ${solution}**\n\n💡 ¿Quieres probar otra?`,
      metadata: { topic: 'math', vocabulary: vocab, corrections: [] }
    };
  }
  
  return {
    text: `¡Vamos con matemáticas! 🧮\n\nDime una ecuación y te guío paso a paso. Por ejemplo:\n• "Resuelve 2x + 5 = 15"\n• "3x - 7 = 14"\n• "x + 10 = 25"\n\n💡 Vocabulario clave: **Ecuación** = Equação (PT) | Equació (CA) | Equation (EN)`,
    metadata: { topic: 'math', vocabulary: vocab, corrections: [] }
  };
}

function generateFalseFriendResponse(ff: any, language: string) {
  const responses = {
    es: `⚠️ ¡Cuidado! **"${ff.pt}"** es un **FALSO AMIGO**.\n\nEn español **NO** significa "${ff.esWrong}", significa **"${ff.esCorrect}"**.\n\n🇧🇷 PT: ${ff.pt}\n🇪🇸 ES: ${ff.esCorrect}\n🏴 CA: ${ff.ca}\n🇬🇧 EN: ${ff.en}\n\n💡 Ejemplo: "Estoy embarazada" = "Estou grávida" (NO "embaraçada" que es avergonzada)`,
    ca: `⚠️ Atenció! **"${ff.pt}"** és un **FALS AMIC**.\n\nEn català **NO** significa "${ff.esWrong}", significa **"${ff.ca}"**.\n\n🇧🇷 PT: ${ff.pt}\n🇪🇸 ES: ${ff.esCorrect}\n🏴 CA: ${ff.ca}\n🇬🇧 EN: ${ff.en}`,
    en: `⚠️ Watch out! **"${ff.pt}"** is a **FALSE FRIEND**.\n\nIn English it does **NOT** mean "${ff.esWrong}", it means **"${ff.en}"**.\n\n🇧🇷 PT: ${ff.pt}\n🇪🇸 ES: ${ff.esCorrect}\n🏴 CA: ${ff.ca}\n🇬🇧 EN: ${ff.en}`,
    pt: `⚠️ Cuidado! **"${ff.pt}"** é um **FALSO AMIGO**.\n\nEm espanhol **NÃO** significa "${ff.esWrong}", significa **"${ff.esCorrect}"**.\n\n🇧🇷 PT: ${ff.pt}\n🇪🇸 ES: ${ff.esCorrect}\n🏴 CA: ${ff.ca}\n🇬🇧 EN: ${ff.en}`,
  };
  
  return {
    text: responses[language as keyof typeof responses] || responses.es,
    metadata: { 
      topic: 'false-friend', 
      vocabulary: [{ concept: ff.esCorrect, pt: ff.pt, es: ff.esCorrect, ca: ff.ca, en: ff.en, category: ff.category }],
      corrections: [{ original: ff.esWrong, corrected: ff.esCorrect, explanation: `Falso amigo: ${ff.pt} ≠ ${ff.esWrong}` }]
    }
  };
}

function generateCatalanResponse(language: string) {
  const vocab = [
    { concept: 'Buenos días', pt: 'Bom dia', es: 'Buenos días', ca: 'Bon dia', en: 'Good morning', category: 'Saludo' },
    { concept: 'Gracias', pt: 'Obrigado', es: 'Gracias', ca: 'Gràcies', en: 'Thank you', category: 'Cortesía' },
    { concept: 'Por favor', pt: 'Por favor', es: 'Por favor', ca: 'Si us plau', en: 'Please', category: 'Cortesía' },
  ];
  
  const responses = {
    es: `¡Genial que quieras practicar catalán! 🇪🇸\n\nTu portugués te da **ventaja única**:\n• **Ç** (C trencada) suena igual que en "Coração" → "Coració"\n• **X** suena "sh" como en "Xícara" → "Xicra"\n• **NY** = tu "LH" y nuestra "Ñ" → "Espanya"\n\nEmpecemos fácil:\n**Bon dia** = Buenos días 🌅\n**Gràcies** = Gracias 🙏\n**Si us plau** = Por favor 😊\n\n¿Cómo se dice "Adiós" en catalán?`,
    ca: `Genial que vulguis practicar català! 🇪🇸\n\nEl teu portugués et dona **avantatge única**:\n• **Ç** sona igual que en "Coração" → "Coració"\n• **X** sona "sh" com en "Xícara" → "Xicra"\n• **NY** = el teu "LH" i la nostra "NY" → "Espanya"\n\nComencem fàcil:\n**Bon dia** = Buenos días 🌅\n**Gràcies** = Gracias 🙏\n**Si us plau** = Por favor 😊\n\nCom es diu "Adéu" en català?`,
    en: `Great you want to practice Catalan! 🇪🇸\n\nYour Portuguese gives you a **unique advantage**:\n• **Ç** sounds like in "Coração" → "Coració"\n• **X** sounds "sh" like in "Xícara" → "Xicra"\n• **NY** = your "LH" and our "Ñ" → "Espanya"\n\nLet's start easy:\n**Bon dia** = Good morning 🌅\n**Gràcies** = Thank you 🙏\n**Si us plau** = Please 😊\n\nHow do you say "Goodbye" in Catalan?`,
    pt: `Legal que você quer praticar catalão! 🇪🇸\n\nSeu português te dá **vantagem única**:\n• **Ç** soa igual que em "Coração" → "Coració"\n• **X** soa "sh" como em "Xícara" → "Xicra"\n• **NY** = seu "LH" e nosso "NH" → "Espanya"\n\nVamos começar fácil:\n**Bon dia** = Bom dia 🌅\n**Gràcies** = Obrigado 🙏\n**Si us plau** = Por favor 😊\n\nComo se diz "Adeus" em catalão?`,
  };
  
  return {
    text: responses[language as keyof typeof responses] || responses.es,
    metadata: { topic: 'catalan', vocabulary: vocab }
  };
}

function generateEnglishResponse(language: string) {
  const vocab = [
    { concept: 'He estudiado', pt: 'Estudei', es: 'He estudiado', ca: 'He estudiat', en: 'I have studied', category: 'Gramática' },
    { concept: 'Presente perfecto', pt: 'Presente perfeito', es: 'Pretérito perfecto', ca: 'Perfet perifràstic', en: 'Present perfect', category: 'Gramática' },
  ];
  
  const responses = {
    es: `¡Practiquemos inglés! 🇬🇧\n\nUsa lo que ya sabes del portugués y español:\n\n**Present Perfect** ≈ **Pretérito Perfeito Composto** (PT) ≈ **Pretérito Perfecto** (ES)\n\nEjemplos:\n• I **have studied** = Eu **estudei** = He **estudiado**\n• She **has lived** = Ela **morou** = Ella **ha vivido**\n• We **have eaten** = Nós **comemos** = Nosotros **hemos comido**\n\n💡 La estructura: **have/has + participio**\n\n¿Quieres que hagamos un ejercicio rápido?`,
    ca: `Practiquem anglès! 🇬🇧\n\nUtilitza el que ja saps del portuguès i castellà:\n\n**Present Perfect** ≈ **Pretérito Perfeito Composto** (PT) ≈ **Pretérito Perfecto** (ES)\n\nExemples:\n• I **have studied** = Eu **estudei** = He **estudiado**\n• She **has lived** = Ela **morou** = Ella **ha viscut**\n• We **have eaten** = Nós **comemos** = Nosaltres **hem menjat**\n\n💡 L'estructura: **have/has + participi**\n\nVols fer un exercici ràpid?`,
    en: `Let's practice English! 🇬🇧\n\nUse what you already know from Portuguese and Spanish:\n\n**Present Perfect** ≈ **Pretérito Perfeito Composto** (PT) ≈ **Pretérito Perfecto** (ES)\n\nExamples:\n• I **have studied** = Eu **estudei** = He **estudiado**\n• She **has lived** = Ela **morou** = Ella **ha vivido**\n• We **have eaten** = Nós **comemos** = Nosotros **hemos comido**\n\n💡 Structure: **have/has + past participle**\n\nWant a quick exercise?`,
    pt: `Vamos praticar inglês! 🇬🇧\n\nUse o que você já sabe do português e espanhol:\n\n**Present Perfect** ≈ **Pretérito Perfeito Composto** (PT) ≈ **Pretérito Perfecto** (ES)\n\nExemplos:\n• I **have studied** = Eu **estudei** = He **estudiado**\n• She **has lived** = Ela **morou** = Ella **ha vivido**\n• We **have eaten** = Nós **comemos** = Nosotros **hemos comido**\n\n💡 Estrutura: **have/has + particípio**\n\nQuer um exercício rápido?`,
  };
  
  return {
    text: responses[language as keyof typeof responses] || responses.es,
    metadata: { topic: 'english', vocabulary: vocab }
  };
}

function generateGreetingResponse(language: string) {
  const responses = {
    es: `¡Hola William! 👋 ¿Qué tal? Soy DANI, tu amigo de estudio.\n\nHoy podemos:\n1️⃣ **Resolver ecuaciones** paso a paso (te guío, no te doy la respuesta)\n2️⃣ **Practicar catalán** (tu portugués ayuda mucho 🇧🇷→🏴)\n3️⃣ **Detectar falsos amigos** ⚠️ (evita situaciones embarazosas)\n4️⃣ **Repasar vocabulario** del insti (mates, ciencias, escolar)\n5️⃣ **Hablar de cultura** Brasil-España 🌉 (Tordesillas, familia real, fútbol, música)\n6️⃣ **Analizar canciones** en 4 idiomas 🎵\n\n¿Por dónde empezamos?`,
    ca: `Hola William! 👋 Què tal? Sóc DANI, el teu amic d'estudi.\n\nAvui podem:\n1️⃣ **Resoldre equacions** pas a pas (te guio, no et dono la resposta)\n2️⃣ **Practicar català** (el teu portuguès ajuda molt 🇧🇷→🏴)\n3️⃣ **Detectar falsos amics** ⚠️ (evita situacions embarassoses)\n4️⃣ **Repassar vocabulari** de l'insti (mates, ciències, escolar)\n5️⃣ **Parlar de cultura** Brasil-Espanya 🌉\n6️⃣ **Analitzar cançons** en 4 idiomes 🎵\n\nPer on comencem?`,
    en: `Hi William! 👋 How are you? I'm DANI, your study buddy.\n\nToday we can:\n1️⃣ **Solve equations** step by step (I guide, don't give answers)\n2️⃣ **Practice Catalan** (your Portuguese helps a lot 🇧🇷→🏴)\n3️⃣ **Spot false friends** ⚠️ (avoid embarrassing situations)\n4️⃣ **Review school vocab** (math, science, daily)\n5️⃣ **Talk culture** Brazil-Spain 🌉 (Tordesillas, royal family, football, music)\n6️⃣ **Analyze songs** in 4 languages 🎵\n\nWhere do we start?`,
    pt: `Oi William! 👋 Tudo bem? Sou o DANI, seu amigo de estudo.\n\nHoje podemos:\n1️⃣ **Resolver equações** passo a passo (te guio, não dou a resposta)\n2️⃣ **Praticar catalão** (seu português ajuda muito 🇧🇷→🏴)\n3️⃣ **Detectar falsos amigos** ⚠️ (evita situações embaraçosas)\n4️⃣ **Revisar vocabulário** da escola (matemática, ciências, escolar)\n5️⃣ **Falar de cultura** Brasil-Espanha 🌉\n6️⃣ **Analisar músicas** em 4 idiomas 🎵\n\nPor onde começamos?`,
  };
  
  return {
    text: responses[language as keyof typeof responses] || responses.es,
    metadata: { topic: 'greeting' }
  };
}

function generateDefaultResponse(language: string) {
  const responses = {
    es: [
      `Entiendo. Cuéntame más... 🤔\n\n¿Quieres que practiquemos algo específico? Mates, catalán, inglés, falsos amigos, cultura, música...`,
      `¡Bien dicho! 🎯 Tu español mejora cada día.\n\n¿Seguimos con mates, idiomas o cultura?`,
      `Me gusta cómo te expresas. 💪\n\n¿Probamos una ecuación rápida o vocabulario nuevo?`,
      `Interesante punto de vista. 🧠\n\n¿Te ayudo con algo de la tarea del insti?`,
    ],
    ca: [
      `Entenc. Explica'm més... 🤔\n\nVols que practiquem algo específic? Mates, català, anglès, falsos amics, cultura, música...`,
      `Ben dit! 🎯 El teu català millora cada dia.\n\nContinuem amb mates, idiomes o cultura?`,
      `M'agrada com t'expresses. 💪\n\nProvem una equació ràpida o vocabulari nou?`,
      `Punt de vista interessant. 🧠\n\nEt puc ajudar amb alguna feina de l'insti?`,
    ],
    en: [
      `I understand. Tell me more... 🤔\n\nWant to practice something specific? Math, Catalan, English, false friends, culture, music...`,
      `Well said! 🎯 Your English gets better every day.\n\nShall we continue with math, languages, or culture?`,
      `I like how you express yourself. 💪\n\nWant to try a quick equation or new vocabulary?`,
      `Interesting perspective. 🧠\n\nCan I help with your school homework?`,
    ],
    pt: [
      `Entendo. Me conta mais... 🤔\n\nQuer praticar algo específico? Matemática, catalão, inglês, falsos amigos, cultura, música...`,
      `Bem dito! 🎯 Seu português melhora a cada dia.\n\nContinuamos com matemática, idiomas ou cultura?`,
      `Gosto de como você se expressa. 💪\n\nQuer tentar uma equação rápida ou vocabulário novo?`,
      `Ponto de vista interessante. 🧠\n\nPosso ajudar com algum dever de casa?`,
    ],
  };
  
  const arr = responses[language as keyof typeof responses] || responses.es;
  return {
    text: arr[Math.floor(Math.random() * arr.length)],
    metadata: { topic: 'general' }
  };
}