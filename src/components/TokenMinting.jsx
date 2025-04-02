// components/TokenMinting.jsx
import React, { useState } from 'react';
import { Transaction, PublicKey, SystemProgram } from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createMintToInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import './TokenMinting.css';

const TokenMinting = ({ wallet, connection, tokens, showNotification, fetchTokens }) => {
  const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mintToken = async (event) => {
    event.preventDefault();

    if (!wallet || !connection) {
      showNotification('Wallet not connected', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const mintPublicKey = new PublicKey(mintAddress);
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        wallet,
        mintPublicKey,
        wallet.publicKey
      );

      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      const decimals = mintInfo?.value?.data?.parsed?.info?.decimals || 0;

      const mintInstruction = createMintToInstruction(
        mintPublicKey,
        associatedTokenAddress,
        wallet.publicKey,
        parseInt(amount) * Math.pow(10, decimals),
        [],
        TOKEN_PROGRAM_ID
      );

      const transaction = new Transaction().add(mintInstruction);
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      await connection.confirmTransaction(signature);

      showNotification(`Successfully minted ${amount} tokens!`, 'success');
      fetchTokens();
      setAmount('');
    } catch (error) {
      console.error('Error minting tokens:', error);
      showNotification(`Failed to mint tokens: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-minting">
      <h2>Mint Tokens</h2>
      <form onSubmit={mintToken}>
        <div className="form-group">
          <label htmlFor="mintAddress">Token Mint Address</label>
          <input
            id="mintAddress"
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter token mint address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount to Mint</label>
          <input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to mint"
            required
          />
        </div>
        <button type="submit" className="mint-button" disabled={isLoading}>
          {isLoading ? 'Minting...' : 'Mint Tokens'}
        </button>
      </form>
    </div>
  );
};

export default TokenMinting;