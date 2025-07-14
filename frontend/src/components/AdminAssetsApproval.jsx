import { useEffect, useState } from "react";
import {
  getAllSubmittedAssets,
  approveAsset,
  deleteAsset,
  rejectAsset,
} from "../services/api";

// Admin dashboard: review and manage submitted (unapproved) assets
export default function AdminAssetsApproval() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch all assets (approved + pending)
  const loadAssets = async () => {
    try {
      const data = await getAllSubmittedAssets();
      setAssets(data);
    } catch (err) {
      console.error("Failed to fetch assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Handle approval action
  const handleApprove = async (id) => {
    try {
      await approveAsset(id);
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === id ? { ...asset, approved: true } : asset
        )
      );
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // Handle deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id);
        setAssets((prev) => prev.filter((asset) => asset.id !== id));
      } catch (err) {
        console.error("Deletion failed:", err);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Rejection reason required.");
      return;
    }

    try {
      await rejectAsset(rejectingId, rejectionReason);
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === rejectingId
            ? { ...asset, status: "rejected", rejectionReason }
            : asset
        )
      );
      setRejectingId(null);
      setRejectionReason("");
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Rejection failed.");
    }
  };

  if (loading) return <p>Loading assets...</p>;

  return (
    <section className="admin-assets">
      <h2>Submitted Assets (Admin Review)</h2>

      {assets.length === 0 ? (
        <p>No assets submitted yet.</p>
      ) : (
        <div className="assets-list">
          {assets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <h3>{asset.title}</h3>
              <p>Valuation: ${asset.valuation.toLocaleString()}</p>
              <p>Token Supply: {asset.tokenSupply}</p>
              <p>Status: {asset.approved ? "Approved" : "Pending"}</p>

              <div className="card-actions">
                {!asset.approved && (
                  <button onClick={() => handleApprove(asset.id)}>
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(asset.id)}
                  className="danger"
                >
                  Delete
                </button>
                {!asset.approved && asset.status !== "rejected" && (
                  <>
                    <button onClick={() => setRejectingId(asset.id)}>
                      Reject
                    </button>
                    {rejectingId === asset.id && (
                      <div>
                        <textarea
                          placeholder="Enter rejection reason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <button onClick={handleReject}>Submit</button>
                        <button onClick={() => setRejectingId(null)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
