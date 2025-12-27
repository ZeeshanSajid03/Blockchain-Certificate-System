require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ENV
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// ABI (same as smart contract)
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_issuer",
        "type": "address"
      }
    ],
    "name": "addIssuer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedIssuers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_certId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_certHash",
        "type": "string"
      }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_certId",
        "type": "string"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


// Blockchain connection (READ ONLY)
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// Hash generator
function generateCertificateHash(name, course, date) {
  const data = `${name}|${course}|${date}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Generate hash API
app.post('/hash', (req, res) => {
  const { name, course, date } = req.body;
  const certHash = generateCertificateHash(name, course, date);
  res.json({ certHash });
});

// Verify certificate API
app.get('/verify/:certId', async (req, res) => {
  try {
    const cert = await contract.verifyCertificate(req.params.certId);

    if (!cert[0]) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    res.json({
      certId: req.params.certId,
      certHash: cert[0],
      issuer: cert[1],
      timestamp: cert[2].toString()
    });
  } catch (err) {
    res.status(500).json({ error: "Blockchain read failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
