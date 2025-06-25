import '../styles/Categories.css';

export default function Categories() {
  const categories = [
    { name: 'Real Estate', image: '/images/real-estate.jpg' },
    { name: 'Automobile', image: '/images/car.jpg' },
    { name: 'Solar Panels', image: '/images/solar.jpg' },
    { name: 'EV Charging Stations', image: '/images/ev.jpg' },
  ];

  return (
    <section className="categories">
      <h2>View Our Range Of Categories</h2>
      <div className="category-grid">
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}