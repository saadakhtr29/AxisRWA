import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { useAccount } from "wagmi";

export default function InvestorDashboard() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const { currentUser } = useAuth();
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFeaturedProducts();
        setAssets(res);
      } catch (err) {
        console.error("Failed to fetch assets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const buyTokens = async (assetId) => {
    try {
      const token = localStorage.getItem("token");
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
            amount: 1, // or prompt user to input amount
          }),
        }
      );

      if (!res.ok) throw new Error("Purchase failed");

      alert("Purchase successful!");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const fetchMyInvestments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/ownership/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch investments");
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  if (loading) return <p>Loading assets...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Featured Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{asset.name}</h2>
            <p>Valuation: ${asset.valuation}</p>
            <p>Location: {asset.location}</p>
            <button
              onClick={() => buyTokens(asset.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Buy Token
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">My Investments</h2>
      <ul className="list-disc pl-6">
        {investments.map((inv) => (
          <li key={inv.id}>
            {inv.assetName} — {inv.amount} tokens
          </li>
        ))}
      </ul>
    </div>
  );
}
