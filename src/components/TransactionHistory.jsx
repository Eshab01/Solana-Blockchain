// components/TransactionHistory.jsx
import React from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ transactions }) => {
  const openExplorer = (signature) => {
    window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank');
  };

  return (
    <div className="transaction-history">
      <h2>Recent Transactions</h2>
      
      {transactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction Signature</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td className="signature">
                  {tx.signature.substring(0, 8)}...{tx.signature.substring(tx.signature.length - 8)}
                </td>
                <td>{tx.blockTime}</td>
                <td className={`status ${tx.status}`}>{tx.status}</td>
                <td>
                  <button 
                    className="view-button"
                    onClick={() => openExplorer(tx.signature)}
                  >
                    View on Explorer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-transactions">No transactions found</p>
      )}
    </div>
  );
};

export default TransactionHistory;