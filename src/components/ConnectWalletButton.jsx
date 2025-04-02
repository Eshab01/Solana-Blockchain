// components/ConnectWalletButton.jsx
import React, { useEffect } from 'react';
import './ConnectWalletButton.css';

const ConnectWalletButton = ({ wallet, setWallet, showNotification }) => {
  useEffect(() => {
    const checkWallet = () => {
      // Check if Phantom or Solflare is installed
      const solanaWallet = window.solana || window.solflare;
      if (!solanaWallet) {
        showNotification("Please install Phantom or Solflare wallet extension!", "error");
      }
    };
    
    checkWallet();
  }, [showNotification]);

  const connectWallet = async () => {
    try {
      const solanaWallet = window.solana || window.solflare;
      
      if (!solanaWallet) {
        showNotification(
          "Wallet not found! Please install Phantom or Solflare extension.",
          "error"
        );
        return;
      }
      
      // Connect to the wallet
      await solanaWallet.connect();
      
      // Set the wallet in state
      setWallet(solanaWallet);
      showNotification("Wallet connected successfully!", "success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showNotification(
        `Failed to connect wallet: ${error.message}`,
        "error"
      );
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setWallet(null);
        showNotification("Wallet disconnected", "info");
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      showNotification(
        `Failed to disconnect wallet: ${error.message}`,
        "error"
      );
    }
  };

  return (
    <div className="wallet-button-container">
      {wallet ? (
        <button className="wallet-button disconnect" onClick={disconnectWallet}>
          Disconnect Wallet
        </button>
      ) : (
        <button className="wallet-button connect" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;