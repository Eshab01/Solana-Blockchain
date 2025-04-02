import React, { useState } from 'react';
import { 
  Keypair, 
  Transaction, 
  SystemProgram, 
  PublicKey 
} from '@solana/web3.js';
import { 
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint, 
  TOKEN_PROGRAM_ID 
} from '@solana/spl-token';

import './TokenCreation.css';

const TokenCreation = ({ wallet, connection, showNotification, fetchTokens }) => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  const createToken = async (event) => {
    event.preventDefault();
    
    if (!wallet || !connection) {
      showNotification("Wallet not connected", "error");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Generate a new keypair for the token mint
      const mintAccount = Keypair.generate();
      
      // Get the minimum balance required for rent exemption
      const mintRent = await getMinimumBalanceForRentExemptMint(connection, MINT_SIZE);

      // ⛔ FIX: Fetch latest blockhash *before* creating transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("finalized");

      // Create instruction to allocate space for the mint
      const createAccountInstruction = SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports: mintRent,
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID
      });

      // Create a new transaction and attach instructions
      const transaction = new Transaction().add(createAccountInstruction);
      transaction.recentBlockhash = blockhash;  // ✅ Uses fresh blockhash
      transaction.feePayer = wallet.publicKey;
      
      // Partially sign the transaction with the mint account
      transaction.partialSign(mintAccount);

      // Request wallet to sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // ⛔ FIX: Fetch **another fresh blockhash** before sending (double verification)
      const { blockhash: newBlockhash, lastValidBlockHeight: newBlockHeight } = await connection.getLatestBlockhash("finalized");

      // Send the signed transaction with latest blockhash
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false, // Ensures transaction is validated before sending
        preflightCommitment: "processed",
      });

      // Confirm transaction with the *newest* blockhash
      await connection.confirmTransaction(
        { signature, blockhash: newBlockhash, lastValidBlockHeight: newBlockHeight },
        "finalized"
      );
      
      showNotification(`Token created successfully! Mint Address: ${mintAccount.publicKey.toString()}`, "success");
      
      // Refresh token list
      fetchTokens();
      
      // Reset form
      setTokenName('');
      setTokenSymbol('');
      setDecimals(9);
      
    } catch (error) {
      console.error("Error creating token:", error);
      showNotification(`Failed to create token: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-creation">
      <h2>Create New Token</h2>
      <form onSubmit={createToken}>
        <div className="form-group">
          <label htmlFor="tokenName">Token Name</label>
          <input
            id="tokenName"
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g., My Token"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tokenSymbol">Token Symbol</label>
          <input
            id="tokenSymbol"
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="e.g., MTK"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="decimals">Decimals</label>
          <input
            id="decimals"
            type="number"
            min="0"
            max="9"
            value={decimals}
            onChange={(e) => setDecimals(Number(e.target.value))}
            required
          />
          <p className="hint">Standard is 9 for most tokens.</p>
        </div>
        
        <button 
          type="submit" 
          className="create-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Token"}
        </button>
      </form>
    </div>
  );
};

export default TokenCreation;
