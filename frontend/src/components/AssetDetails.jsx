import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAssetById } from "../services/api";

// Detailed view of a single approved asset
export default function AssetDetails() {
  const { id } = useParams(); // Extract asset ID from route
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch asset details on mount
    const fetchData = async () => {
      try {
        const data = await getAssetById(id);
        setAsset(data);
      } catch (err) {
        console.error("Failed to fetch asset:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading asset details...</p>;

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
        <strong>Status:</strong> {asset.approved ? "✅ Approved" : "Pending"}
      </p>

      {/* Placeholder: You can add investment call-to-action or ROI metrics here */}
      <div className="cta">
        <button disabled>Invest (Coming Soon)</button>
      </div>
    </section>
  );
}
