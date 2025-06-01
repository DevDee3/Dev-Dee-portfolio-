import React, { useEffect, useState } from "react";
import { fetchOrders } from "./api";

function OrderHistory({ account }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (account) {
      fetchOrders(account).then(setOrders);
    }
  }, [account]);

  if (!account) return null;

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Item {order.itemId} &times; {order.quantity} for {order.totalPaid} ETH (Tx: <a href={`https://sepolia.etherscan.io/tx/${order.txHash}`} target="_blank" rel="noopener noreferrer">{order.txHash.slice(0, 8)}...</a>)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderHistory;