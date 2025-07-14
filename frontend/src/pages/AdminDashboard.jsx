import React, { useState } from "react";
import AdminAssetsApproval from "../components/AdminAssetsApproval";
import AssetDetails from "../components/AssetDetails";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Review and approve submitted assets here.</p>

      <div className="admin-content">
        {!selectedAssetId && (
          <AdminAssetsApproval onSelectAsset={setSelectedAssetId} />
        )}

        {selectedAssetId && (
          <AssetDetails
            assetId={selectedAssetId}
            onBack={() => setSelectedAssetId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;