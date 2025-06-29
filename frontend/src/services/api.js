const API_BASE_URL =import.meta.env.VITE_BASE_URL; 

export async function fetchFeaturedProducts() {
  const response = await fetch(`${API_BASE_URL}/assets`);
  if (!response.ok) throw new Error("Failed to fetch featured products");
  return response.json();
}