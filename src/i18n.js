/* ============================================================
   i18n — Traducciones ES / EN
   Uso: data-i18n="clave" → textContent
        data-i18n-html="clave" → innerHTML
        data-i18n-aria="clave" → aria-label
   ============================================================ */

export const translations = {
  es: {
    /* Nav */
    'nav.about':      '01 SOBRE',
    'nav.work':       '02 TRABAJO',
    'nav.skills':     '03 SKILLS',
    'nav.experience': '04 TRAYECTORIA',
    'nav.contact':    '05 CONTACTO',

    /* Hero */
    'hero.role_prefix':  'Ing. en',
    'hero.bio':          'Titulado en Informática y en Sonido. Desarrollo web y produzco audio.',
    'hero.cta_work':     'VER TRABAJO',
    'hero.cta_contact':  'CONTACTAR',
    'hero.location':     'Santiago, Chile',
    'hero.availability': 'Disponible para proyectos',

    /* About */
    'about.title':          'SOBRE MÍ',
    'about.bio1':           'Hola! soy Patricio Infante, Ingeniero en Informática (Duoc UC) e Ingeniero en Ejecución en Sonido (IP Santo Tomás).',
    'about.bio2':           'Actualmente trabajo como desarrollador web Full Stack, participando en proyectos para clientes nacionales e internacionales. Me enfoco en crear soluciones eficientes, escalables y con buena experiencia de usuario.',
    'about.bio3':           'En mi tiempo libre, disfruto los videojuegos, mis amigos y la música, tanto escuchándola como creándola.',
    'about.bio4_html':      'Megafan de <a href="https://draculatheme.com/" target="_blank" rel="noopener" style="color: var(--accent)">Dracula Theme</a> :)',
    'about.label_location': 'UBICACIÓN',
    'about.val_location':   'Santiago, Chile',
    'about.label_available':'DISPONIBLE',
    'about.val_available':  'Para proyectos freelance y posiciones full-time',
    'about.label_languages':'IDIOMAS',
    'about.val_languages':  'Español (nativo) · Inglés B2 Fluido (Hablado y Escrito) · Japonés básico II',
    'about.social_label':   'ENCUÉNTRAME EN',

    /* Work */
    'work.title':    'TRABAJO',
    'work.p01_desc': 'Sitio web para artista musical estadounidense. Estilo 90\'s, HTML semántico, diseño responsivo, integración multimedia.',
    'work.p02_desc': 'Sitio corporativo para consultora de Data Centers. Logo, estructura informativa y rendimiento inferior a 2s.',
    'work.p03_desc': 'Portfolio para artista 3D. UI design, optimización de assets gráficos y despliegue. Construido con Vite.',
    'work.p04_desc': 'Sitio web personal estilo 90\'s. Diseño y desarrollo propio en HTML, CSS y JavaScript.',
    'work.cta':      'VER PROYECTO',

    /* Skills */
    'skills.cat_sound':     'SONIDO',
    'skills.cat_tools':     'HERRAMIENTAS',
    'skills.tag_recording': 'Grabación',
    'skills.tag_mixing':    'Mezcla',
    'skills.tag_mastering': 'Masterización',
    'skills.tag_production':'Producción Musical',
    'skills.tag_mic':       'Microfonía',

    /* Experience */
    'exp.title':     'TRAYECTORIA',
    'exp.1_period':  'Ago. 2025 — Nov. 2025',
    'exp.1_role':    'Desarrollador Web — Práctica Profesional · Santiago, Chile (Remoto)',
    'exp.1_desc':    'Implementé funcionalidades personalizadas y optimicé el rendimiento de plataformas web con WordPress y Laravel, reduciendo tiempos de carga y mejorando la experiencia de usuario.',
    'exp.2_period':  'Nov. 2024 — Presente',
    'exp.2_role':    'Desarrollador Web · Santiago, Chile',
    'exp.2_desc':    'Diseño y desarrollo de sitios para clientes nacionales e internacionales — Crusher-P, 2Build y Bijoutique. Gestión integral de cada proyecto: levantamiento de requerimientos, desarrollo iterativo, QA y entrega al cliente.',
    'exp.3_period':  'Sep. 2018 — Nov. 2018',
    'exp.3_role':    'Asistente de Producción y Sonido — Práctica Profesional · Santiago, Chile',
    'exp.3_desc':    'Asistencia en grabación, mezcla y masterización de audio en estudio profesional. Montaje y configuración de microfonía e instrumentos para sesiones con artistas de nivel nacional.',
    'exp.4_period':  '2016 — 2020',
    'exp.4_role':    'Editor de Imágenes · Santiago, Chile',
    'exp.4_desc':    'Edición y retoque fotográfico para campañas publicitarias utilizando Adobe Photoshop e Illustrator.',

    /* Contact */
    'contact.title':        'CONTACTO',
    'contact.availability': 'Disponible para proyectos freelance y posiciones full-time',

    /* Footer */
    'footer.built': 'BUILT WITH VITE — 2026',
  },

  en: {
    /* Nav */
    'nav.about':      '01 ABOUT',
    'nav.work':       '02 WORK',
    'nav.skills':     '03 SKILLS',
    'nav.experience': '04 EXPERIENCE',
    'nav.contact':    '05 CONTACT',

    /* Hero */
    'hero.role_prefix':  'Eng. in',
    'hero.bio':          'CS & Sound Engineering graduate. I build for the web and produce audio.',
    'hero.cta_work':     'SEE WORK',
    'hero.cta_contact':  'CONTACT',
    'hero.location':     'Santiago, Chile',
    'hero.availability': 'Available for projects',

    /* About */
    'about.title':          'ABOUT ME',
    'about.bio1':           'Hi! I\'m Patricio Infante, CS Engineer (Duoc UC) and Sound Engineering graduate (IP Santo Tomás).',
    'about.bio2':           'I currently work as a Full Stack web developer on projects for national and international clients. I focus on building efficient, scalable solutions with great user experience.',
    'about.bio3':           'In my free time I enjoy video games, friends, and music — both listening and creating it.',
    'about.bio4_html':      'Big fan of <a href="https://draculatheme.com/" target="_blank" rel="noopener" style="color: var(--accent)">Dracula Theme</a> :)',
    'about.label_location': 'LOCATION',
    'about.val_location':   'Santiago, Chile',
    'about.label_available':'AVAILABLE',
    'about.val_available':  'For freelance projects and full-time positions',
    'about.label_languages':'LANGUAGES',
    'about.val_languages':  'Spanish (native) · English B2 (Spoken & Written) · Basic Japanese II',
    'about.social_label':   'FIND ME ON',

    /* Work */
    'work.title':    'WORK',
    'work.p01_desc': 'Website for an American musician. 90\'s style, semantic HTML, responsive design, multimedia integration.',
    'work.p02_desc': 'Corporate site for a Data Center consultancy. Logo, informational structure and sub-2s load time.',
    'work.p03_desc': '3D artist portfolio. UI design, graphic asset optimization and deployment. Built with Vite.',
    'work.p04_desc': '90\'s-style personal website. Custom design and development in HTML, CSS and JavaScript.',
    'work.cta':      'VIEW PROJECT',

    /* Skills */
    'skills.cat_sound':     'SOUND',
    'skills.cat_tools':     'TOOLS',
    'skills.tag_recording': 'Recording',
    'skills.tag_mixing':    'Mixing',
    'skills.tag_mastering': 'Mastering',
    'skills.tag_production':'Music Production',
    'skills.tag_mic':       'Microphone Technique',

    /* Experience */
    'exp.title':     'EXPERIENCE',
    'exp.1_period':  'Aug. 2025 — Nov. 2025',
    'exp.1_role':    'Web Developer — Professional Internship · Santiago, Chile (Remote)',
    'exp.1_desc':    'Implemented custom features and optimized the performance of web platforms with WordPress and Laravel, reducing load times and improving user experience.',
    'exp.2_period':  'Nov. 2024 — Present',
    'exp.2_role':    'Web Developer · Santiago, Chile',
    'exp.2_desc':    'Design and development of sites for national and international clients — Crusher-P, 2Build and Bijoutique. Full project management: requirements, iterative development, QA and delivery.',
    'exp.3_period':  'Sep. 2018 — Nov. 2018',
    'exp.3_role':    'Production & Sound Assistant — Professional Internship · Santiago, Chile',
    'exp.3_desc':    'Assistance in recording, mixing and mastering at a professional studio. Setup of microphones and instruments for sessions with national-level artists.',
    'exp.4_period':  '2016 — 2020',
    'exp.4_role':    'Image Editor · Santiago, Chile',
    'exp.4_desc':    'Photo editing and retouching for advertising campaigns using Adobe Photoshop and Illustrator.',

    /* Contact */
    'contact.title':        'CONTACT',
    'contact.availability': 'Available for freelance projects and full-time positions',

    /* Footer */
    'footer.built': 'BUILT WITH VITE — 2026',
  },
};

export const roleWords = {
  es: ['Informatica', 'Sonido'],
  en: ['CS', 'Sound Eng.'],
};
