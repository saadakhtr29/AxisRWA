import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

export default function InvestorDashboard() {
  const [assets, setAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState({});
  const [quantities, setQuantities] = useState({});
  const { currentUser } = useAuth();
  const { address, isConnected } = useAccount();

  // Fetch featured assets
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFeaturedProducts();
        setAssets(res);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoadingAssets(false);
      }
    };
    fetchData();
  }, []);

  // Fetch user’s investments
  const fetchMyInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ownership/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch investments");
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      console.error("Investment fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  // Handle purchase
  const buyTokens = async (assetId) => {
    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }

    const amount = quantities[assetId] || 1;
    if (amount < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      setPurchaseLoading((prev) => ({ ...prev, [assetId]: true }));
      const token = localStorage.getItem("token");
      const txHash = ethers.utils.hexlify(ethers.utils.randomBytes(32));

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ownership/buy`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assetId,
            walletAddress: address,
            amount,
            txHash,
          }),
        }
      );

      if (!res.ok) throw new Error("Purchase failed");

      alert("Purchase successful!");
      setQuantities((prev) => ({ ...prev, [assetId]: 1 }));
      fetchMyInvestments();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPurchaseLoading((prev) => ({ ...prev, [assetId]: false }));
    }
  };

  if (loadingAssets) return <p>Loading assets...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Featured Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{asset.title}</h2>
            <p>Valuation: ${asset.valuation.toLocaleString()}</p>
            <p>Location: {asset.location}</p>
            <p>Token Supply: {asset.tokenSupply}</p>

            <div className="mt-2">
              <label className="block mb-1">
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantities[asset.id] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [asset.id]: parseInt(e.target.value),
                    }))
                  }
                  className="w-full border px-2 py-1 mt-1 rounded"
                />
              </label>
              <button
                disabled={purchaseLoading[asset.id] || asset.tokenSupply < 1}
                onClick={() => buyTokens(asset.id)}
                className={`w-full mt-2 px-4 py-2 rounded text-white ${
                  asset.tokenSupply < 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } ${purchaseLoading[asset.id] ? "opacity-50" : ""}`}
              >
                {purchaseLoading[asset.id]
                  ? "Processing..."
                  : asset.tokenSupply < 1
                  ? "Sold Out"
                  : "Buy Token"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">My Investments</h2>
      {investments.length === 0 ? (
        <p className="text-gray-500 mt-2">No investments yet.</p>
      ) : (
        <ul className="list-disc pl-6 mt-2">
          {investments.map((inv) => (
            <li key={inv.id}>
              {inv.assetName} — {inv.amount} token
              {inv.amount > 1 ? "s" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
