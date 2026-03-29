# Solana Wallet React App

A React application for connecting to a Solana wallet and performing operations via a backend API. **Note: This application is currently configured for use on Solana Devnet only.**

## Features

- Connect to a Solana wallet (Phantom, Solflare, etc.)
- Display wallet public key and SOL balance
- Send and receive SOL transactions through a backend
- React-based frontend with Vite

## Tech Stack

- React.js  
- Vite.js 
- Backend API

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/solana-wallet-react.git
cd solana-wallet-react
```

2. Install dependencies:

```bash
npm install
```

or with Yarn:

```bash
yarn install
```

## Configuration

1. Create a `.env` file in the project root:

```env
# Solana network to use (Only devnet is supported)
VITE_SOLANA_NETWORK=devnet

# Backend API endpoint
VITE_ENDPOINT=https://your-backend-url.com
```

## Usage

1. Start the development server:

```bash
npm run dev
```

2. Open your browser at `http://localhost:5173`  
3. Connect your Solana wallet and perform operations via the backend API.

## Scripts

- `npm run dev` – Runs the app in development mode  
- `npm run build` – Builds the app for production  
- `npm run preview` – Preview the production build  

## Contributing

1. Fork the repository  
2. Create a new branch (`git checkout -b feature-name`)  
3. Make your changes  
4. Commit (`git commit -m "Add feature"`)  
5. Push (`git push origin feature-name`)  
6. Open a Pull Request