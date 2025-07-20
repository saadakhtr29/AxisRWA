import React, { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../services/api";
import { useAuth } from "../context/AuthProvider";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import tokenABI from "../abis/AXISRWAOwnershipToken.json";
import "../styles/InvestorDashboard.css";

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

  // Fetch user's investments
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

  // Handle token purchase
  const buyTokens = async (assetId) => {
    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }

    const asset = assets.find((a) => a.id === assetId);
    const amount = quantities[assetId] || 1;

    if (!asset?.tokenAddress) {
      alert("This asset has not been tokenized yet.");
      return;
    }

    if (amount < 1) {
      alert("Please enter a valid quantity.");
      return;
    }

    try {
      setPurchaseLoading((prev) => ({ ...prev, [assetId]: true }));

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        asset.tokenAddress,
        tokenABI.abi,
        signer
      );

      const decimals = 18;
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      // Transfer tokens to platform (assumes user has balance)
      const tx = await contract.transfer(
        import.meta.env.VITE_PLATFORM_WALLET,
        amountInWei
      );
      const receipt = await tx.wait();
      const txHash = receipt.hash;

      // Notify backend of ownership
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

  if (loadingAssets) return <p className="loading">Loading assets...</p>;

  return (
    <div className="investor-dashboard">
      <h1>Featured Assets</h1>

      <div className="asset-grid">
        {assets.map((asset) => (
          <div key={asset.id} className="asset-card">
            <h2>{asset.title}</h2>
            <p>Valuation: ${asset.valuation.toLocaleString()}</p>
            <p>Location: {asset.location}</p>
            <p>Token Supply: {asset.tokenSupply}</p>

            {asset.tokenAddress ? (
              <p className="token-address">
                Token Address:{" "}
                <a
                  href={`https://mumbai.polygonscan.com/address/${asset.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {asset.tokenAddress.slice(0, 6)}...
                  {asset.tokenAddress.slice(-4)}
                </a>
              </p>
            ) : (
              <p className="token-pending">Token not deployed yet</p>
            )}

            <label>
              Quantity:
              <input
                type="number"
                min="1"
                value={quantities[asset.id] || ""}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [asset.id]: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </label>

            <button
              disabled={
                purchaseLoading[asset.id] ||
                asset.tokenSupply < 1 ||
                !asset.tokenAddress
              }
              onClick={() => buyTokens(asset.id)}
            >
              {purchaseLoading[asset.id]
                ? "Processing..."
                : asset.tokenSupply < 1
                ? "Sold Out"
                : !asset.tokenAddress
                ? "Token Not Ready"
                : "Buy Token"}
            </button>
          </div>
        ))}
      </div>

      <div className="investments">
        <h2>My Investments</h2>
        {investments.length === 0 ? (
          <p className="loading">No investments yet.</p>
        ) : (
          <ul>
            {investments.map((inv) => (
              <li key={inv.id}>
                {inv.assetName} — {inv.amount} token{inv.amount > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
