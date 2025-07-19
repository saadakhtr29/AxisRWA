import React, { useState } from "react";
import PartnerAssets from "../components/PartnerAssets";
import AssetForm from "../components/AssetForm";
import AssetDetails from "../components/AssetDetails";
import "../styles/PartnerDashboard.css";

export const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("assets");
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  return (
    <div className="partner-dashboard">
      <h1>Partner Dashboard</h1>
      <p>Welcome, Partner. Manage your listed assets here.</p>

      <div className="partner-tabs">
        <button
          className={activeTab === "assets" ? "active" : ""}
          onClick={() => {
            setActiveTab("assets");
            setSelectedAssetId(null); // Reset selection
          }}
        >
          My Assets
        </button>
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => {
            setActiveTab("create");
            setSelectedAssetId(null); // Reset selection
          }}
        >
          Create Asset
        </button>
      </div>

      <div className="partner-content">
        {activeTab === "assets" && !selectedAssetId && (
          <PartnerAssets onSelectAsset={setSelectedAssetId} />
        )}

        {activeTab === "assets" && selectedAssetId && (
          <AssetDetails
            assetId={selectedAssetId}
            onBack={() => setSelectedAssetId(null)}
          />
        )}

        {activeTab === "create" && <AssetForm />}
      </div>
    </div>
  );
};
