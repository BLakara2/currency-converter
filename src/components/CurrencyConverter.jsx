import { useState, useId } from 'react'
import { useExchangeRates } from '../hooks/useExchangeRates'
import styles from './CurrencyConverter.module.css'

/* ── Drapeaux emoji par code ISO 2 lettres ── */
const FLAG = code => {
  if (!code || code.length !== 3) return '🌐'
  const base = 0x1F1E6
  return String.fromCodePoint(
    base + (code.charCodeAt(0) - 65),
    base + (code.charCodeAt(1) - 65)
  )
}

/* ── Devises prioritaires (MGA en premier) ── */
const PRIORITY_CURRENCIES = ['MGA', 'EUR', 'USD', 'GBP', 'JPY', 'CHF']

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1')
  const [from,   setFrom]   = useState('MGA')
  const [to,     setTo]     = useState('EUR')

  const amountId = useId()
  const fromId   = useId()
  const toId     = useId()

  const { rates, currencies, loading, error, lastUpdated } = useExchangeRates(from)

  /* ── Tri : prioritaires d'abord, puis le reste par ordre alpha ── */
  const sortedCurrencies = currencies.length > 0
    ? [
        ...PRIORITY_CURRENCIES.filter(c => currencies.includes(c)),
        ...currencies
          .filter(c => !PRIORITY_CURRENCIES.includes(c))
          .sort((a, b) => a.localeCompare(b)),
      ]
    : []

  /* ── Calculs ── */
  const numAmount = parseFloat(amount) || 0
  const converted = rates[to] != null ? (numAmount * rates[to]).toFixed(4) : null
  const rate      = rates[to] != null ? rates[to].toFixed(6) : null

  /* ── Handlers ── */
  const handleSwap = () => {
    setFrom(to)
    setTo(from)
  }

  const handleAmountChange = e => {
    const val = e.target.value
    if (val === '' || /^\d*\.?\d*$/.test(val)) setAmount(val)
  }

  return (
    <div className={styles.page}>

      {/* ── Fond décoratif ── */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
        <div className={styles.bgGrid} />
      </div>

      <main className={styles.card} aria-label="Convertisseur de devises">

        {/* ── En-tête ── */}
        <header className={styles.header}>
          <p className={styles.eyebrow}>Taux officiels en temps réel</p>
          <h1 className={styles.title}>Convertisseur<br /><em>de monnaies</em></h1>
          {lastUpdated && (
            <p className={styles.date} aria-live="polite">
              Mis à jour le <strong>{lastUpdated}</strong>
            </p>
          )}
        </header>

        {/* ── Erreur ── */}
        {error && (
          <div role="alert" className={styles.errorBanner}>
            ⚠️ Impossible de charger les taux : {error}
          </div>
        )}

        {/* ── Formulaire ── */}
        <form
          className={styles.form}
          onSubmit={e => e.preventDefault()}
          aria-label="Formulaire de conversion"
        >
          {/* Montant */}
          <div className={styles.field}>
            <label htmlFor={amountId} className={styles.label}>Montant</label>
            <input
              id={amountId}
              className={styles.input}
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              aria-label="Montant à convertir"
            />
          </div>

          {/* Ligne devises */}
          <div className={styles.currencyRow}>

            {/* De */}
            <div className={styles.field}>
              <label htmlFor={fromId} className={styles.label}>De</label>
              <div className={styles.selectWrap}>
                <span className={styles.flag} aria-hidden="true">{FLAG(from)}</span>
                <select
                  id={fromId}
                  className={styles.select}
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  aria-label="Devise source"
                  disabled={loading || sortedCurrencies.length === 0}
                >
                  {sortedCurrencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap */}
            <button
              type="button"
              className={styles.swapBtn}
              onClick={handleSwap}
              aria-label="Inverser les deux devises"
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4" />
                <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>

            {/* Vers */}
            <div className={styles.field}>
              <label htmlFor={toId} className={styles.label}>Vers</label>
              <div className={styles.selectWrap}>
                <span className={styles.flag} aria-hidden="true">{FLAG(to)}</span>
                <select
                  id={toId}
                  className={styles.select}
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  aria-label="Devise cible"
                  disabled={loading || sortedCurrencies.length === 0}
                >
                  {sortedCurrencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </form>

        {/* ── Résultat ── */}
        <section
          className={styles.result}
          aria-live="polite"
          aria-atomic="true"
          aria-label="Résultat de la conversion"
        >
          {loading ? (
            <div className={styles.loader}>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Chargement des taux…</span>
            </div>
          ) : converted !== null ? (
            <>
              <p className={styles.resultMain}>
                <span className={styles.resultFrom}>
                  {numAmount.toLocaleString('fr-FR')} {from}
                </span>
                <span className={styles.resultEquals}>=</span>
                <span className={styles.resultTo}>
                  {parseFloat(converted).toLocaleString('fr-FR', { maximumFractionDigits: 4 })} {to}
                </span>
              </p>
              <p className={styles.resultRate}>
                1 {from} = <strong>{rate}</strong> {to}
              </p>
            </>
          ) : (
            <p className={styles.resultPlaceholder}>Saisissez un montant</p>
          )}
        </section>

        {/* ── Footer ── */}
        <footer className={styles.footer}>
          <p>
            Source :&nbsp;
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">
              exchangerate-api.com
            </a>
            &nbsp;·&nbsp; By Bryan Lakara
          </p>
        </footer>

      </main>
    </div>
  )
}