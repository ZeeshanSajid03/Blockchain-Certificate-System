import React, { useState } from "react";
import { ethers } from "ethers";

// 🔴 UPDATE THESE
const CONTRACT_ADDRESS = "0x8E546E66526aA005dd45Fc83D3382Bdd43b841E7";
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

const backendURL = "http://localhost:3000";

function App() {
  const [wallet, setWallet] = useState(null);
  const [issueData, setIssueData] = useState({
    certId: "", name: "", course: "", date: ""
  });
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  // Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required");
      return;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    setWallet(accounts[0]);
  };

  // Issue Certificate
  const handleIssue = async (e) => {
    e.preventDefault();

    try {
      // 1. Get hash from backend
      const res = await fetch(`${backendURL}/hash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueData)
      });
      const { certHash } = await res.json();

      // 2. Blockchain transaction
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.issueCertificate(
        issueData.certId,
        certHash
      );

      await tx.wait();

      alert("Certificate issued on blockchain!");

    } catch (err) {
      alert("Issuing failed: " + err.message);
    }
  };

  // Verify Certificate
  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await fetch(`${backendURL}/verify/${verifyId}`);
    const data = await res.json();
    setVerifyResult(data);
  };

  return (
    <div className="container my-5">
      <h1>Blockchain Certificate System</h1>

      {/* Wallet Login */}
      {!wallet ? (
        <button onClick={connectWallet} className="btn btn-dark mb-4">
          Connect MetaMask
        </button>
      ) : (
        <p><strong>Connected Wallet:</strong> {wallet}</p>
      )}

      {/* Issue Certificate */}
      <div className="card p-4 mb-4">
        <h3>Issue Certificate</h3>
        <form onSubmit={handleIssue}>
          <input className="form-control my-2" placeholder="Certificate ID"
            required onChange={e => setIssueData({...issueData, certId: e.target.value})} />
          <input className="form-control my-2" placeholder="Name"
            required onChange={e => setIssueData({...issueData, name: e.target.value})} />
          <input className="form-control my-2" placeholder="Course"
            required onChange={e => setIssueData({...issueData, course: e.target.value})} />
          <input className="form-control my-2" type="date"
            required onChange={e => setIssueData({...issueData, date: e.target.value})} />
          <button className="btn btn-primary mt-2" disabled={!wallet}>
            Issue Certificate
          </button>
        </form>
      </div>

      {/* Verify Certificate */}
      <div className="card p-4">
        <h3>Verify Certificate</h3>
        <form onSubmit={handleVerify}>
          <input className="form-control my-2" placeholder="Certificate ID"
            required onChange={e => setVerifyId(e.target.value)} />
          <button className="btn btn-success">Verify</button>
        </form>

        {verifyResult && verifyResult.certHash && (
          <div className="mt-3">
            <p><strong>Hash:</strong> {verifyResult.certHash}</p>
            <p><strong>Issuer:</strong> {verifyResult.issuer}</p>
            <p><strong>Time:</strong> {new Date(verifyResult.timestamp * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
