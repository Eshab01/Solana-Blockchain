import React, { useState } from 'react';
import { Transaction, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';

import './TokenTransfer.css';

const TokenTransfer = ({ wallet, connection, tokens, showNotification, fetchTokens }) => {
  const [selectedToken, setSelectedToken] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const transferToken = async (event) => {
    event.preventDefault();
    
    if (!wallet || !connection) {
      showNotification("Wallet not connected", "error");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const mintPublicKey = new PublicKey(selectedToken);
      const recipientPublicKey = new PublicKey(recipientAddress);
      
      const sourceTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        wallet.publicKey
      );
      
      const destinationTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        recipientPublicKey
      );
      
      const destinationAccount = await connection.getAccountInfo(destinationTokenAccount);
      
      let transaction = new Transaction();
      
      if (!destinationAccount) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            destinationTokenAccount,
            recipientPublicKey,
            mintPublicKey
          )
        );
      }
      
      const transferInstruction = createTransferInstruction(
        sourceTokenAccount,
        destinationTokenAccount,
        wallet.publicKey,
        parseInt(amount) * Math.pow(10, 9)
      );
      
      transaction.add(transferInstruction);
      
      const signature = await wallet.sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature);
      
      showNotification(
        `Successfully transferred ${amount} tokens to ${recipientAddress.substring(0, 8)}...`,
        "success"
      );
      
      fetchTokens();
      setAmount('');
      setRecipientAddress('');
      
    } catch (error) {
      console.error("Error transferring tokens:", error);
      showNotification(
        `Failed to transfer tokens: ${error.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-transfer">
      <h2>Transfer Tokens</h2>
      <form onSubmit={transferToken}>
        <div className="form-group">
          <label htmlFor="token">Select Token</label>
          <select
            id="token"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            required
          >
            <option value="">Select a token</option>
            {tokens.map((token, index) => (
              <option key={index} value={token.mint}>
                {token.name || token.mint.substring(0, 8)}... (Balance: {token.balance})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            id="recipient"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient wallet address"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="transferAmount">Amount to Transfer</label>
          <input
            id="transferAmount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to transfer"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="transfer-button"
          disabled={isLoading || !selectedToken}
        >
          {isLoading ? "Transferring..." : "Transfer Tokens"}
        </button>
      </form>
    </div>
  );
};

export default TokenTransfer;