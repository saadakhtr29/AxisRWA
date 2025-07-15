const API_BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * Fetch a list of featured (approved) assets from the backend.
 * - Returns: an array of featured assets (products)
 * - Throws error if request fails or data is not an array.
 * * Fetch approved featured assets (default limit = 6)
 */
export async function signup(email, password, role, wallet, idToken) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, role, wallet }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Signup failed");
  }

  return await res.json();
}

// Create new asset
export async function createAsset({ title, valuation, tokenSupply }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, valuation, tokenSupply }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to create asset");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in createAsset():", error.message);
    throw error;
  }
}

// Update asset by ID
export async function updateAsset(id, { title, valuation, tokenSupply }) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, valuation, tokenSupply }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to update asset");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateAsset():", error.message);
    throw error;
  }
}

export async function fetchFeaturedProducts(limit = 6) {
  try {
    const response = await fetch(`${API_BASE_URL}/assets?limit=${limit}`);
    if (!response.ok)
      throw new Error(`Server responded with ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data?.assets && Array.isArray(data.assets)) return data.assets;
    if (data?.data && Array.isArray(data.data)) return data.data;
    throw new Error("Unexpected response format for featured products.");
  } catch (error) {
    console.error("Error in fetchFeaturedProducts():", error.message);
    throw error;
  }
}

/**
 * Fetch asset by ID
 * Used in: AssetDetails.jsx (public/investor view)
 */
export async function getAssetById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    if (!response.ok) throw new Error("Asset not found");
    return await response.json();
  } catch (error) {
    console.error("Error in getAssetById():", error.message);
    throw error;
  }
}

/**
 * Fetch assets submitted by the current partner (requires auth token)
 * Used in: PartnerAssets.jsx
 */
export async function getPartnerAssets() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/partner/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch partner assets");
    return await response.json();
  } catch (error) {
    console.error("Error in getPartnerAssets():", error.message);
    throw error;
  }
}

/**
 * Submit new or updated asset (used in AssetForm.jsx)
 * - method: "POST" for create, "PUT" for update
 * - id is optional (for update)
 */
export async function saveAsset({ title, valuation, tokenSupply }, id = null) {
  try {
    const token = localStorage.getItem("token");
    const method = id ? "PUT" : "POST";
    const endpoint = id ? `/assets/${id}` : "/assets";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, valuation, tokenSupply }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to save asset");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in saveAsset():", error.message);
    throw error;
  }
}

/**
 * Delete an asset (partner or admin)
 */
export async function deleteAsset(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete asset");
    return await response.json();
  } catch (error) {
    console.error("Error in deleteAsset():", error.message);
    throw error;
  }
}

/**
 * Approve an asset (admin only)
 */
export async function approveAsset(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/approve/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to approve asset");
    return await response.json();
  } catch (error) {
    console.error("Error in approveAsset():", error.message);
    throw error;
  }
}

/**
 * Get all submitted assets for admin approval (requires admin token)
 * Used in: AdminAssetsApproval.jsx
 */
export async function getAllSubmittedAssets() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/admin/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(errorMsg || "Failed to fetch submitted assets");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getAllSubmittedAssets():", error.message);
    throw error;
  }
}

export async function rejectAsset(id, reason) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/assets/reject/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) throw new Error("Failed to reject asset");
    return await response.json();
  } catch (error) {
    console.error("Error in rejectAsset():", error.message);
    throw error;
  }
}

export async function purchaseOwnership(assetId, quantity, txHash) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/ownership/purchase`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assetId, quantity, txHash }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Ownership purchase failed");
  }

  return await res.json();
}

export async function updateUserRole(userId, role) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/role`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.message || "Failed to update user role");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in updateUserRole():", error.message);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to fetch users");
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Error in getAllUsers():", error.message);
    throw error;
  }
}

export async function banUser(userId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/admin/user/${userId}/ban`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to ban user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in banUser():", error.message);
    throw error;
  }
}
