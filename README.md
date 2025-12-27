# Blockchain Certificate System

A decentralized certificate issuance and verification system built on **Ethereum (Sepolia test network)**. This project demonstrates the use of **smart contracts, frontend integration, and backend APIs** to securely issue, store, and verify digital certificates in a permissioned blockchain environment.

---

## Features

* **Permissioned Certificate Issuance** – Only admin-approved wallets can issue certificates.
* **Blockchain-Based Storage** – Certificates are stored immutably on-chain.
* **Verification API** – Anyone can verify certificate authenticity via frontend or backend endpoints.
* **Frontend Integration** – React app with MetaMask wallet authentication.
* **Secure Hashing** – Certificate data is hashed before being stored on-chain.
* **Multi-Environment Ready** – Sepolia testnet compatible, ready to extend to mainnet.

---

## Project Structure

```
Blockchain Certificate System/
│
├── certificate-frontend/          # React frontend with MetaMask integration
├── certificate-backend/           # Node.js + Express backend for hashing & verification
└── contracts/         # Solidity smart contracts (CertificateIssuer.sol)
```

---

## Technologies Used

* **Blockchain / Smart Contract:** Solidity, Ethereum (Sepolia testnet)
* **Frontend:** React, ethers.js, MetaMask
* **Backend:** Node.js, Express, crypto
* **Tools:** Remix IDE, Visual Studio Code, Git/GitHub

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Blockchain-Certificate-System.git
cd "Blockchain Certificate System"
```

### 2. Install frontend dependencies

```bash
cd certificate-frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../certificate-backend
npm install
```

### 4. Setup environment variables

* Create `.env` files in both frontend and backend.
* Example `.env` for backend:

```text
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0xYourDeployedContractAddress
PRIVATE_KEY=your_private_wallet_key
```

> **Do not commit `.env` to GitHub.**

---

### 5. Run the backend

```bash
cd certificate-backend
npm run start
```

### 6. Run the frontend

```bash
cd certificate-frontend
npm run dev
```

---

## Usage

1. Connect MetaMask to the **Sepolia test network**.
2. Admin deploys the smart contract and adds authorized issuers.
3. Authorized issuers can issue certificates via the frontend.
4. Anyone can verify certificate authenticity through the verification form.

---

## Permissions & Roles

| Role              | Capabilities                            |
| ----------------- | --------------------------------------- |
| Admin             | Add authorized issuers, deploy contract |
| Authorized Issuer | Issue certificates                      |
| Public / Anyone   | Verify certificates                     |

---

## Notes

* Certificates are hashed with SHA-256 before being stored on-chain.
* All transactions are signed via MetaMask — **private keys never leave user wallets**.
* Backend provides a read-only interface for verification.

---
