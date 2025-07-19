import "../styles/Categories.css";

import realEstateImg from "../assets/images/real-estate.jpg";
import automobileImg from "../assets/images/automobile.jpg";
import solarPanelImg from "../assets/images/solar-panel.avif";
import evChargingImg from "../assets/images/ev-charging-stations.jpg";

export const Categories = () => {
  const categories = [
    { name: "Real Estate", image: realEstateImg },
    { name: "Automobile", image: automobileImg },
    { name: "Solar Panels", image: solarPanelImg },
    { name: "EV Charging Stations", image: evChargingImg },
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
};
