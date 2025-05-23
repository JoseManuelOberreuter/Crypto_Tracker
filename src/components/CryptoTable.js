import React, { useState, useEffect, useRef, useCallback } from "react";
import { getMultipleTickers } from "../services/binanceApi";
import { symbols, names } from "../constants/cryptos";

export const CryptoTable = ({ onSelectCrypto }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const tableRef = useRef(null);

  // Detectar el ancho de la pantalla para cambiar entre vista móvil y desktop
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCryptoData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMultipleTickers(symbols);
      if (data) {
        setCryptoData(data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setError("Error al cargar los datos de las criptomonedas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000);
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto);
    if (onSelectCrypto) {
      onSelectCrypto(crypto);
    }
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="crypto-table-container" ref={tableRef}>
      <style jsx>{`
        .crypto-table-container {
          background: var(--card-background);
          border-radius: var(--border-radius);
          padding: 1rem;
          margin: 1rem 0;
          box-shadow: var(--box-shadow);
        }

        @media (min-width: 768px) {
          .crypto-table-container {
            padding: 1.5rem;
            margin: 1.5rem 0;
          }
        }

        @media (min-width: 992px) {
          .crypto-table-container {
            padding: 2rem;
            margin: 2rem 0;
          }
        }

        .crypto-table-container h2 {
          color: var(--text-color);
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }

        @media (min-width: 768px) {
          .crypto-table-container h2 {
            font-size: 1.5rem;
            margin-bottom: 2rem;
          }
        }

        /* Estilos para la tabla en desktop */
        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .crypto-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .crypto-table th,
        .crypto-table td {
          padding: 0.75rem 0.5rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (min-width: 768px) {
          .crypto-table th,
          .crypto-table td {
            padding: 1rem;
          }
        }

        .crypto-table th {
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .crypto-table td {
          color: var(--text-color);
          font-size: 1rem;
        }

        .crypto-table tr {
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .crypto-table tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .crypto-table tr.selected {
          background: rgba(0, 200, 83, 0.1);
        }

        .crypto-table tr.selected td {
          color: var(--accent-color);
        }

        /* Estilos para tarjetas en móvil */
        .crypto-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .crypto-card {
          background: var(--secondary-color);
          border-radius: var(--border-radius);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .crypto-card:active {
          transform: scale(0.98);
        }

        .crypto-card.selected {
          background: rgba(0, 200, 83, 0.1);
          border-color: var(--accent-color);
        }

        .crypto-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .crypto-card-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .crypto-name {
          display: flex;
          flex-direction: column;
        }

        .crypto-symbol {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--text-color);
        }

        .crypto-full-name {
          color: var(--text-secondary);
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .crypto-price, .crypto-volume {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .crypto-volume {
          align-items: flex-end;
        }

        .price-label, .volume-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .price-value, .volume-value {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-color);
        }

        .price-change {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .price-change.positive {
          color: var(--accent-color);
          background: rgba(0, 200, 83, 0.1);
        }

        .price-change.negative {
          color: #ff1744;
          background: rgba(255, 23, 68, 0.1);
        }

        /* Estilos para el estado de carga y error */
        .loading-container,
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          color: var(--text-secondary);
          min-height: 200px;
        }

        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border-top-color: var(--accent-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          font-size: 0.9rem;
        }

        .error-container {
          color: #ff1744;
          text-align: center;
        }

        .error-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 23, 68, 0.1);
          color: #ff1744;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .retry-button {
          margin-top: 1rem;
          background: var(--secondary-color);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .retry-button:hover {
          border-color: var(--accent-color);
        }
      `}</style>
      <h2>Precios de Criptomonedas</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Cargando datos...</div>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">!</div>
          <div>{error}</div>
          <button className="retry-button" onClick={fetchCryptoData}>
            Reintentar
          </button>
        </div>
      ) : viewportWidth < 768 ? (
        <div className="crypto-cards">
          {cryptoData.map((crypto, index) => (
            <div
              key={crypto.symbol}
              className={`crypto-card ${selectedCrypto === crypto.symbol ? "selected" : ""}`}
              onClick={() => handleCryptoSelect(crypto.symbol)}
            >
              <div className="crypto-card-header">
                <div className="crypto-name">
                  <span className="crypto-symbol">{crypto.symbol}</span>
                  <span className="crypto-full-name">{names[index]}</span>
                </div>
                <div className={`price-change ${parseFloat(crypto.priceChangePercent) >= 0 ? "positive" : "negative"}`}>
                  {parseFloat(crypto.priceChangePercent) >= 0 ? "↑" : "↓"} {Math.abs(parseFloat(crypto.priceChangePercent)).toFixed(2)}%
                </div>
              </div>
              <div className="crypto-card-body">
                <div className="crypto-price">
                  <span className="price-label">Precio:</span>
                  <span className="price-value">${parseFloat(crypto.lastPrice).toFixed(2)}</span>
                </div>
                <div className="crypto-volume">
                  <span className="volume-label">Vol 24h:</span>
                  <span className="volume-value">${Number(parseFloat(crypto.volume)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Criptomoneda</th>
                <th>Precio Actual</th>
                <th>Cambio 24h</th>
                <th>Volumen 24h</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto, index) => (
                <tr
                  key={crypto.symbol}
                  className={selectedCrypto === crypto.symbol ? "selected" : ""}
                  onClick={() => handleCryptoSelect(crypto.symbol)}
                >
                  <td>
                    <div className="crypto-name">
                      <span className="crypto-symbol">{crypto.symbol}</span>
                      <span className="crypto-full-name">{names[index]}</span>
                    </div>
                  </td>
                  <td>${parseFloat(crypto.lastPrice).toFixed(2)}</td>
                  <td className={`price-change ${parseFloat(crypto.priceChangePercent) >= 0 ? "positive" : "negative"}`}>
                    {parseFloat(crypto.priceChangePercent) >= 0 ? "+" : ""}{parseFloat(crypto.priceChangePercent).toFixed(2)}%
                  </td>
                  <td>${Number(parseFloat(crypto.volume)).toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 