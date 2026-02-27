import { useState, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_API_KEY

export function useExchangeRates(baseCurrency = 'MGA') {
  const [rates,       setRates]       = useState({})
  const [currencies,  setCurrencies]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    if (!baseCurrency) return

    let cancelled = false
    setLoading(true)
    setError(null)

    const url = API_KEY
      ? `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
      : `https://api.frankfurter.app/latest?from=${baseCurrency}`

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (cancelled) return

        let allRates = {}
        let date = null

        if (API_KEY) {
          // exchangerate-api.com
          if (data.result !== 'success') throw new Error(data['error-type'])
          allRates = data.conversion_rates
          date     = data.time_last_update_utc?.slice(0, 16) ?? null
        } else {
          // frankfurter.app (pas de MGA, fallback)
          allRates = { [data.base]: 1, ...data.rates }
          date     = data.date
        }

        setRates(allRates)
        setCurrencies(Object.keys(allRates))
        setLastUpdated(date)
        setLoading(false)
      })
      .catch(err => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [baseCurrency])

  return { rates, currencies, loading, error, lastUpdated }
}