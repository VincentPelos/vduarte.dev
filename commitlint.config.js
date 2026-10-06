// Convención: docs/05-flujo-git/commits.md
// Tipo en inglés, descripción en español, primera línea de máx. 72 caracteres.
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'style', 'refactor', 'docs', 'test', 'chore', 'ci', 'perf', 'release'],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'hero',
        'bento',
        'experiencia',
        'proyectos',
        'skills',
        'educacion',
        'contacto',
        'nav',
        'caso',
        'contenido',
        'diseno',
        'particulas',
        'animaciones',
        'seo',
        'ci',
        'deps',
        'boveda',
        'proyecto',
        'arquitectura',
        'decisiones',
        'git',
        'bitacora',
      ],
    ],
  },
};
