// Dependency-free flat config: the demo is a zero-build, no-node_modules app, so the
// `globals` package is deliberately not used.
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  localStorage: 'readonly',
  navigator: 'readonly',
  location: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  setInterval: 'readonly',
  clearInterval: 'readonly',
  requestAnimationFrame: 'readonly',
  fetch: 'readonly',
  alert: 'readonly',
  Event: 'readonly',
  CustomEvent: 'readonly',
  HTMLElement: 'readonly',
  getComputedStyle: 'readonly',
};

const nodeGlobals = {
  module: 'writable',
  require: 'readonly',
  process: 'readonly',
  globalThis: 'readonly',
};

// Defined inline in index.html rather than in js/ — a real cross-file coupling.
const htmlGlobals = {
  App: 'readonly',
  Wizard: 'readonly',
  WizardOpen: 'writable',
  UserModalOpen: 'writable',
};

// One singleton per module file, consumed by the other files via <script> tag order.
const moduleGlobals = {
  INTENTS: 'readonly',
  JOURNEYS: 'readonly',
  matchIntent: 'readonly',
  MockAPI: 'readonly',
  Walkthrough: 'readonly',
  Recorder: 'readonly',
  Docs: 'readonly',
  SOURCE_ARTICLES: 'readonly',
  Assistant: 'readonly',
  selfcheck: 'readonly',
};

export default [
  {
    // Vendored, upstream-owned. architecture-portal ships its own eslint.config.mjs,
    // which ESLint 10 would otherwise resolve (and fail on — it has no node_modules).
    ignores: [
      'architecture/architecture-portal/**',
      'planning/_bmad/**',
      'archived/**',
      '**/.agents/**',
      '**/.claude/**',
      '.venv/**',
    ],
  },
  {
    files: ['prototype/walkthrough-assistant/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...browserGlobals,
        ...nodeGlobals,
        ...htmlGlobals,
        ...moduleGlobals,
      },
    },
    rules: {
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern:
            '^(INTENTS|JOURNEYS|matchIntent|MockAPI|Walkthrough|Recorder|Docs|SOURCE_ARTICLES|Assistant|selfcheck)$',
          caughtErrors: 'none',
        },
      ],
      eqeqeq: ['warn', 'always'],
    },
  },
];
