  # Solana Wallet Integration and Token Interaction

## Overview
This application enables seamless integration with the Solana blockchain, allowing users to interact with their Solana wallets, create tokens, mint tokens, and send tokens using the Solana SPL Token Program on Devnet. The user interface is designed to be intuitive, responsive, and user-friendly, providing real-time feedback on transactions.

## Features

### 1. Solana Wallet Integration
- **Wallet Authentication**: Connect and authenticate with a Solana wallet (e.g., Phantom or Solflare).
- **Wallet Management**: Users can connect and disconnect their wallets easily.
- **Wallet Information Display**: Shows the connected wallet address and SOL balance.
- **Error Handling**: Proper handling of connection failures and user interaction issues.

### 2. Smart Contract Interaction
- **Token Creation**: Allows users to create new tokens using the Solana SPL Token Program.
- **Minting Tokens**: Enables users to mint new tokens and receive feedback on success or failure.
- **Sending Tokens**: Provides an interface for users to send tokens to other wallets with transaction confirmations.
- **Transaction Processing**: Ensures all transactions are processed correctly and displays relevant details.

### 3. UI/UX Design
- **Modern and Responsive Interface**: Easy navigation with a clean design.
- **Connect Wallet Button**: Clear call-to-action for wallet connection.
- **Balance Display**: Shows SOL and token balances.
- **Transaction Status Feedback**: Displays loading states, error messages, and success notifications.

### 4. Blockchain Data Fetching
- **Fetching Token Balances**: Retrieves and displays token and SOL balances for the connected wallet.
- **Transaction History**: Shows recent transactions related to minting and token transfers.

### 5. Responsiveness
- **Mobile-Friendly Design**: The application is optimized for different screen sizes and devices.

### 6. Code Quality & Performance
- **Modular Codebase**: Clean, maintainable, and well-structured.
- **Optimized Performance**: Ensures fast loading and smooth interactions.
- **Error Handling**: Manages edge cases and network failures effectively.

## Setup and Installation

### Prerequisites
Ensure that the following dependencies are installed:
- **Node.js** (LTS version recommended)
- **A Solana wallet (e.g., Phantom, Solflare)**

### Steps to Run Locally
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Eshab01/Solana-Blockchain
   cd Solana-Blockchain
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the application:**
   ```sh
   npm run dev
   ```
4. **Connect Wallet & Interact with Solana**
   - Open the application in a browser.
   - Connect a Solana wallet.
   - Create, mint, and send tokens.

## Deployment
The application is deployed on **Vercel**. You can access the live demo at:
- [Live Demo](<solana-wallet-integration-and-token-interaction.vercel.app>)

## Tech Stack
- **Frontend**: React, Next.js
- **Solana Web3**: `@solana/web3.js`, `@solana/spl-token`
- **Wallet Providers**: Phantom, Solflare
- **Styling**: Tailwind CSS

## Resources
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Phantom Wallet](https://phantom.app/)
- [Solflare Wallet](https://docs.solflare.com/solflare)
- [Solana Token Program](https://spl.solana.com/token)
- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)
- [Solana Airdrop Tool](https://faucet.solana.com/)

## Additional Features (Bonus)
- **Real-Time Blockchain Data**: Updates token balances and market prices dynamically.
- **Transaction History**: Displays user transaction logs (minting, transfers, etc.).
- **Web3 Event Listeners**: Tracks wallet events such as token transfers and smart contract interactions.

## Author
- **Eshab Sachan**

For any queries, feel free to reach out!
