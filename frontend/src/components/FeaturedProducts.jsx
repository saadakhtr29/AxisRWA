import { useEffect, useState } from 'react';
import { fetchFeaturedProducts } from '../services/api';
import '../styles/FeaturedProducts.css';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <section className="featured-section">
      <h2>Featured Products</h2>
      <div className="products-grid">
        {products.map(product => (
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