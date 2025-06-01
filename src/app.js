import React, { useState } from "react";
import { ethers } from "ethers";

// Replace with your contract ABI and address:
const CONTRACT_ADDRESS = "0x57bc96abE4C888f472C3e4EAE789D5933b410907";
const ABI = [
  "function setItem(uint256 itemId, uint256 price, string name)",
  "function buyItem(uint256 itemId, uint256 quantity) payable",
  "function withdraw()",
  "function prices(uint256) view returns (uint256)",
  "function names(uint256) view returns (string)"
];

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [itemId, setItemId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      const signer = await ethProvider.getSigner();
      setProvider(ethProvider);
      setSigner(signer);
      setContract(new ethers.Contract(CONTRACT_ADDRESS, ABI, signer));
      setMessage("Wallet connected");
    } else {
      setMessage("Install MetaMask!");
    }
  };

  const setItem = async () => {
    try {
      const tx = await contract.setItem(itemId, ethers.parseEther(price), name);
      await tx.wait();
      setMessage("Item set!");
    } catch (e) {
      setMessage(e.reason || e.message);
    }
  };

  const buyItem = async () => {
    try {
      const itemPrice = await contract.prices(itemId);
      const total = itemPrice * BigInt(quantity);
      const tx = await contract.buyItem(itemId, quantity, { value: total });
      await tx.wait();
      setMessage("Item bought!");
    } catch (e) {
      setMessage(e.reason || e.message);
    }
  };

  const withdraw = async () => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setMessage("Funds withdrawn!");
    } catch (e) {
      setMessage(e.reason || e.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>ClothShop DApp</h1>
      <button onClick={connectWallet}>Connect Wallet</button>
      <hr />
      <div>
        <h2>Set Item (Owner only)</h2>
        <input type="number" value={itemId} onChange={e => setItemId(Number(e.target.value))} placeholder="Item ID" />
        <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price in ETH" />
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <button onClick={setItem}>Set Item</button>
      </div>
      <hr />
      <div>
        <h2>Buy Item</h2>
        <input type="number" value={itemId} onChange={e => setItemId(Number(e.target.value))} placeholder="Item ID" />
        <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} placeholder="Quantity" />
        <button onClick={buyItem}>Buy Item</button>
      </div>
      <hr />
      <div>
        <h2>Withdraw (Owner only)</h2>
        <button onClick={withdraw}>Withdraw</button>
      </div>
      <hr />
      <div>
        <b>Status:</b> {message}
      </div>
    </div>
  );
}

export default App;