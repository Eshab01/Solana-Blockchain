// App.jsx
import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { 
  Token, 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  MintLayout
} from '@solana/spl-token';
import './App.css';
import ConnectWalletButton from './components/ConnectWalletButton';
import TokenCreation from './components/TokenCreation';
import TokenMinting from './components/TokenMinting';
import TokenTransfer from './components/TokenTransfer';
import WalletInfo from './components/WalletInfo';
import TransactionHistory from './components/TransactionHistory';
import Notification from './components/Notification';

function App() {
  const [wallet, setWallet] = useState(null);
  const [connection, setConnection] = useState(null);
  const [balance, setBalance] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    const conn = new Connection(clusterApiUrl('devnet'), 'confirmed');
    setConnection(conn);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet && connection) {
        try {
          const bal = await connection.getBalance(wallet.publicKey);
          setBalance(bal / 1000000000); // Convert lamports to SOL
          fetchTokens();
          fetchTransactions();
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
    const intervalId = setInterval(fetchBalance, 10000);
    return () => clearInterval(intervalId);
  }, [wallet, connection]);

  const fetchTokens = async () => {
    if (!wallet || !connection) return;

    try {
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        wallet.publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const tokenData = [];
      for (const { pubkey, account } of tokenAccounts.value) {
        const accountInfo = account.data;
        const tokenAccountInfo = MintLayout.decode(accountInfo);
        
        try {
          const mintInfo = await connection.getParsedAccountInfo(new PublicKey(tokenAccountInfo.mint));
          tokenData.push({
            mint: tokenAccountInfo.mint.toString(),
            balance: tokenAccountInfo.amount.toString(),
            decimals: mintInfo.value.data.parsed.info.decimals,
            name: `Token ${tokenData.length + 1}`
          });
        } catch (error) {
          console.error("Error fetching token info:", error);
        }
      }
      
      setTokens(tokenData);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!wallet || !connection) return;

    try {
      const signatures = await connection.getSignaturesForAddress(wallet.publicKey);
      const transactionData = signatures.map(sig => ({
        signature: sig.signature,
        blockTime: new Date(sig.blockTime * 1000).toLocaleString(),
        status: sig.confirmationStatus
      }));
      
      setTransactions(transactionData.slice(0, 10)); // Show latest 10 transactions
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Solana Token Manager</h1>
        <ConnectWalletButton 
          wallet={wallet} 
          setWallet={setWallet} 
          showNotification={showNotification} 
        />
      </header>

      {wallet ? (
        <div className="main-content">
          <WalletInfo 
            address={wallet.publicKey.toString()} 
            balance={balance} 
            tokens={tokens} 
          />
          
          <div className="tabs">
            <button 
              className={activeTab === 'create' ? 'active' : ''}
              onClick={() => setActiveTab('create')}
            >
              Create Token
            </button>
            <button 
              className={activeTab === 'mint' ? 'active' : ''}
              onClick={() => setActiveTab('mint')}
            >
              Mint Token
            </button>
            <button 
              className={activeTab === 'transfer' ? 'active' : ''}
              onClick={() => setActiveTab('transfer')}
            >
              Transfer Token
            </button>
            <button 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              Transaction History
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'create' && (
              <TokenCreation 
                wallet={wallet} 
                connection={connection} 
                showNotification={showNotification}
                fetchTokens={fetchTokens}
              />
            )}
            
            {activeTab === 'mint' && (
              <TokenMinting 
                wallet={wallet} 
                connection={connection} 
                tokens={tokens}
                showNotification={showNotification}
                fetchTokens={fetchTokens}
              />
            )}
            
            {activeTab === 'transfer' && (
              <TokenTransfer 
                wallet={wallet} 
                connection={connection} 
                tokens={tokens}
                showNotification={showNotification}
                fetchTokens={fetchTokens}
              />
            )}
            
            {activeTab === 'history' && (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        </div>
      ) : (
        <div className="wallet-prompt">
          <p>Please connect your Solana wallet to use this application</p>
        </div>
      )}

      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
        />
      )}
      
      <footer className="footer">
        <p>Solana Token Manager - Running on Devnet</p>
      </footer>
    </div>
  );
}

export default App;