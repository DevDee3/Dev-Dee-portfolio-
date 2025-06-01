import React, { useState } from "react";
import { ethers } from "ethers";
import { postOrder } from "./api";

function Catalog({ items, account, contract, provider }) {
  const [buying, setBuying] = useState(null);

  const buy = async (item) => {
    setBuying(item.id);
    const priceWei = ethers.parseEther(item.priceEth);
    try {
      const tx = await contract.buyItem(item.id, 1, { value: priceWei });
      await tx.wait();
      // Save order to backend
      await postOrder({
        buyer: account,
        itemId: item.id,
        quantity: 1,
        totalPaid: item.priceEth,
        txHash: tx.hash,
      });
      alert("Purchase successful!");
    } catch (e) {
      alert("Transaction failed: " + e.message);
    }
    setBuying(null);
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {items.map(item => (
        <div key={item.id} style={{ border: "1px solid #eee", padding: 20 }}>
          <img src={`/assets/${item.logo}`} alt={item.name} width={100} />
          <h2>{item.name}</h2>
          <p>Price: {item.priceEth} ETH</p>
          <button onClick={() => buy(item)} disabled={!account || buying === item.id}>
            {buying === item.id ? "Processing..." : "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Catalog;