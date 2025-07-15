import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetById, purchaseOwnership } from "../services/api";
import { useAccount } from "wagmi";
import { ethers } from "ethers";

// Detailed view of a single approved asset
export default function AssetDetails() {
  const { id } = useParams(); // Extract asset ID from route
  const [asset, setAsset] = useState(null);
  const [loadingAsset, setLoadingAsset] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const { address, isConnected } = useAccount();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAssetById(id);
        setAsset(data);
      } catch (err) {
        console.error("Failed to fetch asset:", err.message);
      } finally {
        setLoadingAsset(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setLoadingPurchase(true);

      // Generate a fake transaction hash (mocked)
      const txHash = ethers.utils.hexlify(ethers.utils.randomBytes(32));

      // Submit to backend
      const response = await purchaseOwnership(asset.id, quantity, txHash);
      alert("Tokens purchased successfully!");
      console.log(response);
    } catch (err) {
      console.error("Purchase failed:", err.message);
      alert(err.message || "Purchase failed");
    } finally {
      setLoadingPurchase(false);
    }
  };

  if (loadingAsset) return <p>Loading asset details...</p>;

  if (!asset || !asset.approved)
    return <p>Asset not found or not approved for public view.</p>;

  return (
    <section className="asset-details">
      <h2>{asset.title}</h2>
      <p>
        <strong>Valuation:</strong> ${asset.valuation.toLocaleString()}
      </p>
      <p>
        <strong>Token Supply:</strong> {asset.tokenSupply}
      </p>
      <p>
        <strong>Status:</strong> {asset.approved ? "Approved" : "Pending"}
      </p>

      <div className="cta">
        <label>
          Quantity:{" "}
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </label>

        <button disabled={loadingPurchase} onClick={handlePurchase}>
          {loadingPurchase ? "Processing..." : "Buy Tokens"}
        </button>
      </div>
    </section>
  );
}
