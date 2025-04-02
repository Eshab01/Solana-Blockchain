// components/WalletInfo.jsx
import React from 'react';
import './WalletInfo.css';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';


const WalletInfo = ({ address, balance, tokens }) => {
  const shortenAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard!");
  };

  return (
    <div className="wallet-info">
      <div className="address-container">
        <h3>Wallet Address</h3>
        <div className="address">
          <span>{shortenAddress(address)}</span>
          <button className="copy-button" onClick={copyAddress}>
            Copy
          </button>
        </div>
      </div>
      
      <div className="balance-container">
        <h3>SOL Balance</h3>
        <p className="balance">{balance.toFixed(4)} SOL</p>
        <button className="airdrop-button" onClick={async () => {
          try {
            // This will only work on devnet
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

            const signature = await connection.requestAirdrop(
              new PublicKey(address),
              LAMPORTS_PER_SOL
            );

            await connection.confirmTransaction(signature);
            alert("Airdrop successful! 1 SOL added to your wallet.");
          } catch (error) {
            console.error("Airdrop failed:", error);
            alert("Airdrop failed: " + error.message);
          }
        }}>
          Request Airdrop
        </button>
      </div>
      
      {tokens.length > 0 && (
        <div className="tokens-container">
          <h3>Tokens</h3>
          <ul className="token-list">
            {tokens.map((token, index) => (
              <li key={index} className="token-item">
                <div className="token-name">{token.name}</div>
                <div className="token-balance">
                  {token.balance} {token.symbol || ''}
                </div>
                <div className="token-mint" title={token.mint}>
                  Mint: {token.mint.substring(0, 8)}...
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletInfo;