import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/20/solid'

function StockPrices() {
  const [company, setCompany] = useState('AAPL')
  const [stockPrice, setStockPrice] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStockPrice()
    const interval = setInterval(fetchStockPrice, 1000)
    return () => clearInterval(interval)
  }, [company])

  const fetchStockPrice = async () => {
    try {
      setLoading(true)
      const api = process.env.REACT_APP_API_KEY
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${company}&token=cn7fu4hr01qgjtj4jde0cn7fu4hr01qgjtj4jdeg`,
      )
      setStockPrice(response.data)
      console.log(response.data)
      setError(null)
    } catch (error) {
      setError('Failed to fetch stock price. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompanyChange = (symbol) => {
    setCompany(symbol)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Stock Prices</h1>

      <div className="flex justify-center mb-8">
        <ul className="flex space-x-4">
          {['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'NFLX'].map((symbol) => (
            <li key={symbol}>
              <button
                onClick={() => handleCompanyChange(symbol)}
                className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                  company === symbol
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900'
                }`}
              >
                {symbol}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {loading && (
        <div className="text-center">
          <div className="loader"></div>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {stockPrice && (
        <div className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{company} Stock Price</h2>
          <div className="flex justify-between my-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-gray-500" />
              <div>
                <p className="text-lg">
                  <strong>High:</strong> ${stockPrice.h}
                </p>
                <p className="text-lg">
                  <strong>Low:</strong> ${stockPrice.l}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {stockPrice.c - stockPrice.pc > 0 ? (
                <ArrowUpIcon className="h-6 w-6 mr-2 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-6 w-6 mr-2 text-red-500" />
              )}

              <div className="flex flex-col">
                <p className="text-lg">
                  <strong>Previous Close:</strong> ${stockPrice.pc}
                </p>
                <p className="text-lg">
                  <strong>Change:</strong> $
                  <span
                    className={
                      stockPrice.c - stockPrice.pc > 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }
                  >
                    {(stockPrice.c - stockPrice.pc).toFixed(2)} ({stockPrice.cp}
                    %)
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-6 w-6 mr-2 text-gray-500" />
              <div className="flex flex-col">
                <p className="text-lg">
                  <strong>Current Price:</strong> ${stockPrice.c}
                </p>
                <p className="text-gray-500 text-sm">
                  Updated at: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StockPrices
