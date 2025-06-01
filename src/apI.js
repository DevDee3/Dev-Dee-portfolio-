import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Catalog from "./components/Catalog.";
import OrderHistory from "./components/OrderHistory";
import "./App.css";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const ABI = [
  // Only the needed parts of ABI
  "function buyItem(uint256 itemId, uint256 quantity) payable",
  "function prices(uint256) view returns (uint256)",
  "function names(uint256) view returns (string)",
];

const ITEMS = [
  { id: 1, name: "Ethereum Tee", priceEth: "0.02", logo: "eth.png" },
  { id: 2, name: "Solana Hoodie", priceEth: "0.03", logo: "sol.png" },
  { id: 3, name: "Bitcoin Cap", priceEth: "0.05", logo: "btc.png" },
];

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState();
  const [contract, setContract] = useState();

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethProvider);
      ethProvider.getSigner().then(signer => {
        setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const [addr] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(addr);
  };

  return (
    <div>
      <h1>Crypto Cloth Shop</h1>
      {!account && <button onClick={connectWallet}>Connect Wallet</button>}
      <Catalog
        items={ITEMS}
        account={account}
        contract={contract}
        provider={provider}
      />
      <OrderHistory account={account} />
    </div>
  );
}

export default App;