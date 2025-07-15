import React, { useState } from "react";
import AdminAssetsApproval from "../components/AdminAssetsApproval";
import AdminUserManagement from "../components/AdminUserManagement";
import AssetDetails from "../components/AssetDetails";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [view, setView] = useState("assets"); // 'assets' or 'users'

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="tabs">
        <button
          className={view === "assets" ? "active" : ""}
          onClick={() => setView("assets")}
        >
          Asset Approval
        </button>
        <button
          className={view === "users" ? "active" : ""}
          onClick={() => setView("users")}
        >
          User Management
        </button>
      </div>

      <div className="admin-content">
        {view === "assets" && !selectedAssetId && (
          <AdminAssetsApproval onSelectAsset={setSelectedAssetId} />
        )}

        {view === "assets" && selectedAssetId && (
          <AssetDetails
            assetId={selectedAssetId}
            onBack={() => setSelectedAssetId(null)}
          />
        )}

        {view === "users" && <AdminUserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;