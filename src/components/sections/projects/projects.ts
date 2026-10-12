import { SIGNAL_EASING, signalTime } from '../../../lib/projects';

/**
 * Lista y detalle de Proyectos (#162, decisión 023).
 * - Elegir un proyecto muestra su detalle; el cambio va con View Transitions ("Transformar").
 * - Elegir una skill enciende las etapas del pipeline donde se usó: un punto baja por la línea y
 *   enciende cada una al pasar ("Señal"); al llegar, se abren los textos.
 * El contenido nunca espera a la animación: los estados se aplican al tiro y la animación solo
 * los acompaña. Con `prefers-reduced-motion`, nada se mueve.
 */

const DURATION = 420;
const STEP_GAP = 110;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const { x1, y1, x2, y2 } = SIGNAL_EASING;
const SIGNAL_CURVE = `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const timers = new WeakMap<HTMLElement, number[]>();

function selectProject(list: HTMLElement, id: string) {
  const buttons = [...list.querySelectorAll<HTMLButtonElement>('[data-project-select]')];
  const current = buttons.find((button) => button.getAttribute('aria-expanded') === 'true');
  if (current?.dataset.projectSelect === id) return;

  const clicked = buttons.find((button) => button.dataset.projectSelect === id);
  const apply = () => {
    // En celular el detalle va bajo su botón: al cerrarse uno de arriba, el elegido subiría y
    // podría salir de la pantalla. Se compensa el scroll para que quede donde se hizo clic.
    const before = clicked?.getBoundingClientRect().top ?? 0;
    for (const button of buttons) {
      const open = button.dataset.projectSelect === id;
      button.setAttribute('aria-expanded', String(open));
      const detail = document.getElementById(button.getAttribute('aria-controls') ?? '');
      if (detail) detail.hidden = !open;
    }
    const after = clicked?.getBoundingClientRect().top ?? 0;
    if (after !== before) window.scrollBy(0, after - before);
  };
  if (reduced() || !document.startViewTransition) apply();
  else document.startViewTransition(apply);
}

function setSkill(detail: HTMLElement, name: string | null) {
  const steps = detail.querySelector<HTMLElement>('[data-steps]');
  if (!steps) return;
  for (const chip of detail.querySelectorAll<HTMLElement>('[data-skill]')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.skill === name));
  }

  const items = [...steps.querySelectorAll<HTMLElement>('[data-step]')];
  const lit = items.filter(
    (item) => name && JSON.parse(item.dataset.skills ?? '[]').includes(name),
  );
  if (name) steps.dataset.skill = name;
  else delete steps.dataset.skill;
  for (const item of items) item.toggleAttribute('data-on', lit.includes(item));
  for (const use of steps.querySelectorAll<HTMLElement>('[data-use]')) {
    const open = use.dataset.use === name;
    use.hidden = !open;
    use.toggleAttribute('data-open', open);
  }

  for (const el of detail.querySelectorAll<HTMLElement>('[data-pipe-idle]')) el.hidden = !!name;
  for (const el of detail.querySelectorAll<HTMLElement>('[data-pipe-active]')) el.hidden = !name;
  const label = detail.querySelector('[data-pipe-skill]');
  if (label) label.textContent = name ?? '';
  const count = detail.querySelector('[data-pipe-count]');
  if (count) count.textContent = `${lit.length}/${items.length}`;

  if (name && !reduced()) signal(steps, lit);
}

/** "Señal": un punto recorre la línea de puntos y enciende cada etapa al pasar. */
function signal(steps: HTMLElement, lit: HTMLElement[]) {
  // Corta una señal anterior que no haya terminado.
  for (const animation of steps.getAnimations({ subtree: true })) animation.cancel();
  steps.querySelector('[data-signal]')?.remove();
  for (const timer of timers.get(steps) ?? []) clearTimeout(timer);
  if (!lit.length) return;

  // El punto baja con los textos cerrados, así las etapas no se mueven mientras pasa.
  const uses = lit.flatMap((item) => [
    ...item.querySelectorAll<HTMLElement>('[data-use]:not([hidden])'),
  ]);
  for (const use of uses) use.removeAttribute('data-open');

  // El punto de cada etapa tiene `position: relative`, así su offsetTop ya es relativo a la lista.
  const dotTop = (item: HTMLElement) =>
    item.querySelector<HTMLElement>('[data-dot]')?.offsetTop ?? 0;
  const first = steps.querySelector<HTMLElement>('[data-step]');
  const start = first ? dotTop(first) : 0;
  const end = dotTop(lit[lit.length - 1]) - start;
  const total = Math.max(DURATION, (end / 20) * (STEP_GAP + 60));

  const dot = document.createElement('span');
  dot.dataset.signal = '';
  dot.className =
    'pointer-events-none absolute top-0 left-0 size-[7px] rounded-full bg-fg shadow-[0_0_0_3px_var(--color-bg)]';
  steps.append(dot);
  const travel = dot.animate(
    [
      { translate: `0 ${start}px`, opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { translate: `0 ${start + end}px`, opacity: 1 },
    ],
    { duration: total, easing: SIGNAL_CURVE, fill: 'forwards' },
  );
  travel.finished
    .then(
      () =>
        dot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).finished,
    )
    .then(() => dot.remove())
    .catch(() => dot.remove());

  // WAAPI no resuelve var() en los keyframes: se leen los tokens ya calculados.
  const tokens = getComputedStyle(document.documentElement);
  const muted = tokens.getPropertyValue('--color-muted').trim();
  const fg = tokens.getPropertyValue('--color-fg').trim();
  for (const item of lit) {
    const delay = total * signalTime(end ? (dotTop(item) - start) / end : 1);
    item
      .querySelector('[data-dot]')
      ?.animate(
        [{ scale: 0, opacity: 0 }, { scale: 2.2, opacity: 1, offset: 0.55 }, { scale: 1.45 }],
        { duration: DURATION, delay, easing: EASE, fill: 'backwards' },
      );
    item.querySelector('.step-label')?.animate([{ color: muted }, { color: fg }], {
      duration: DURATION * 0.6,
      delay,
      fill: 'backwards',
    });
  }

  // Al llegar, se abren los textos uno tras otro.
  timers.set(
    steps,
    uses.map((use, i) =>
      window.setTimeout(
        () => {
          use.setAttribute('data-open', '');
          use.querySelector('p')?.animate(
            [
              { opacity: 0, translate: '0 -6px' },
              { opacity: 1, translate: '0 0' },
            ],
            { duration: DURATION, delay: DURATION * 0.25, easing: EASE, fill: 'backwards' },
          );
        },
        total + i * STEP_GAP * 0.5,
      ),
    ),
  );
}

document.addEventListener('click', (event) => {
  const target = event.target as Element;
  const select = target.closest<HTMLElement>('[data-project-select]');
  const list = select?.closest<HTMLElement>('[data-projects]');
  if (select && list) {
    selectProject(list, select.dataset.projectSelect ?? '');
    return;
  }
  const chip = target.closest<HTMLElement>('[data-skill]');
  const detail = chip?.closest<HTMLElement>('[data-project]');
  if (chip && detail) {
    setSkill(
      detail,
      chip.getAttribute('aria-pressed') === 'true' ? null : (chip.dataset.skill ?? null),
    );
  }
});
