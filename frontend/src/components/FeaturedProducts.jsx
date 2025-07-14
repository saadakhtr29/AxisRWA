import { useEffect, useState } from "react";
import { fetchFeaturedProducts } from "../services/api";
import "../styles/FeaturedProducts.css";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeaturedProducts()
      .then((res) => {
        // Check structure of returned data
        if (Array.isArray(res)) {
          setProducts(res); // If pure array
        } else if (res?.data && Array.isArray(res.data)) {
          setProducts(res.data); // If { data: [...] }
        } else {
          setError("Invalid response structure from API.");
          console.error("Unexpected API response:", res);
        }
      })
      .catch((err) => {
        console.error("Error fetching featured products:", err);
        setError("Failed to load featured products.");
      });
  }, []);

  return (
    <section className="featured-section">
      <div className="featured-section-header">
        <h2>Featured Products</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur. Tristique quis dis dolor
          dignissim. Neque ut porttitor ut aliquet.
        </p>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.location}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
