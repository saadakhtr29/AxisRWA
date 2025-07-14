import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAsset, updateAsset } from "../services/api";

// Reusable Asset Form component for both create and edit modes
export default function AssetForm({ isEdit = false, initialData = {} }) {
  const navigate = useNavigate();

  // Local form state initialized with default or existing values
  const [form, setForm] = useState({
    title: initialData.title || "",
    valuation: initialData.valuation || "",
    tokenSupply: initialData.tokenSupply || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Input validation
    if (
        !form.title.trim() ||
        isNaN(form.valuation) ||
        Number(form.valuation) <= 0 ||
        isNaN(form.tokenSupply) ||
        Number(form.tokenSupply) <= 0
      ) {
        setError("Please enter valid values.");
        setLoading(false);
        return;
      }

    try {
      if (isEdit && initialData.id) {
        // Update existing asset
        await updateAsset(initialData.id, form);
        navigate("/partner");
      } else {
        // Create new asset
        await createAsset(form);
        navigate("/partner");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asset-form-container">
      <h2>{isEdit ? "Edit Asset" : "Create New Asset"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="asset-form">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Valuation (USD):
          <input
            type="number"
            name="valuation"
            step="any"
            min="1"
            value={form.valuation}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Token Supply:
          <input
            type="number"
            name="tokenSupply"
            min="1"
            value={form.tokenSupply}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : isEdit ? "Update Asset" : "Create Asset"}
        </button>
      </form>
    </div>
  );
}
