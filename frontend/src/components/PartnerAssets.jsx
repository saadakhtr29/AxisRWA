import { useEffect, useState } from "react";
import { getPartnerAssets, deleteAsset } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

// Partner dashboard to view and manage their submitted assets
export default function PartnerAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch assets owned by this partner
  const loadAssets = async () => {
    try {
      const data = await getPartnerAssets();
      setAssets(data);
    } catch (err) {
      console.error("Failed to load partner assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id);
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
      } catch (err) {
        alert("Failed to delete asset.");
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading your assets...</p>;

  return (
    <section className="partner-assets">
      <div className="partner-assets-header">
        <h2>Your Submitted Assets</h2>
        <Link to="/partner/create" className="btn-primary">
          + Create New Asset
        </Link>
      </div>

      {assets.length === 0 ? (
        <p>You haven’t added any assets yet.</p>
      ) : (
        <div className="assets-list">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <h3>{asset.title}</h3>
              <p>Valuation: ${asset.valuation.toLocaleString()}</p>
              <p>Token Supply: {asset.tokenSupply}</p>
              <p>Status: {asset.approved ? "✅ Approved" : "⏳ Pending"}</p>

              <div className="card-actions">
                <button onClick={() => navigate(`/partner/edit/${asset.id}`)}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
