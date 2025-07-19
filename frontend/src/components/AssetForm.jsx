import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAsset, updateAsset, uploadAssetImage } from "../services/api";

export default function AssetForm({ isEdit = false, initialData = {} }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: initialData.title || "",
    valuation: initialData.valuation || "",
    tokenSupply: initialData.tokenSupply || "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
      let asset;

      if (isEdit && initialData.id) {
        // Update asset (no image re-upload in edit for now)
        asset = await updateAsset(initialData.id, form);
      } else {
        // Create new asset
        asset = await createAsset(form);
      }

      // Optional image upload (after asset creation)
      if (imageFile && asset?.id) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await uploadAssetImage(asset.id, formData);
      }

      navigate("/partner");
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

        <label>
          Asset Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : isEdit ? "Update Asset" : "Create Asset"}
        </button>
      </form>
    </div>
  );
}
