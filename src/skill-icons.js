/**
 * skill-icons.js — inyecta SVGs de Simple Icons en los .tag de skills
 */
import * as si from 'simple-icons';

/* Mapa: texto del tag → clave de simple-icons (siNombreIcon) */
const MAP = {
  'HTML':         si.siHtml5,
  'CSS':          si.siCss3,
  'JavaScript':   si.siJavascript,
  'TypeScript':   si.siTypescript,
  'React':        si.siReact,
  'Vite':         si.siVite,
  'GSAP':         si.siGreensock,
  'Tailwind CSS': si.siTailwindcss,
  'Bootstrap':    si.siBootstrap,
  'Next.js':      si.siNextdotjs,
  'WordPress':    si.siWordpress,
  'Laravel':      si.siLaravel,
  'Node.js':      si.siNodedotjs,
  'Django':       si.siDjango,
  'Flask':        si.siFlask,
  'Firebase':     si.siFirebase,
  'Supabase':     si.siSupabase,
  'MySQL':        si.siMysql,
  'PostgreSQL':   si.siPostgresql,
  'Vercel':       si.siVercel,
  'Pro Tools':    si.siProtools,
  'Git':          si.siGit,
  'Photoshop':    si.siAdobephotoshop,
  'Illustrator':  si.siAdobeillustrator,
  'Premiere':     si.siAdobepremierepro,
};

export function initSkillIcons() {
  document.querySelectorAll('.skills__tags .tag').forEach(tag => {
    const name = tag.textContent.trim();
    const icon = MAP[name];
    if (!icon) return;

    const svg = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="skill-icon" aria-hidden="true"><path d="${icon.path}"/></svg>`;
    tag.innerHTML = svg + tag.textContent;
  });
}
