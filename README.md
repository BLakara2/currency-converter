# 💱 currency-converter-web
## [WEB – React + Vite]

Convertisseur de devises web avec taux officiels BCE mis à jour quotidiennement.

## Stack
- **React 18** + **Vite 5**
- **frankfurter.app** — API gratuite, taux BCE, ~30 devises
- CSS Modules + Google Fonts (DM Serif Display / DM Mono / DM Sans)

## Structure
```
currency-converter-web/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                         ← Point d'entrée React
    ├── App.jsx                          ← Composant racine
    ├── index.css                        ← Variables CSS globales + reset
    ├── hooks/
    │   └── useExchangeRates.js          ← Fetch API frankfurter.app
    └── components/
        ├── CurrencyConverter.jsx        ← UI principale
        └── CurrencyConverter.module.css ← Styles (CSS Modules)
```

## Installation & lancement
```bash
pnpm install
pnpm dev
```

## Build production
```bash
pnpm build
pnpm preview
```