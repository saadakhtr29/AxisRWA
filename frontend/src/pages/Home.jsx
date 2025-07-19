import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FancyFrame from "../components/FancyFrame.jsx";
import FeaturedProducts from '../components/FeaturedProducts';
import SellingProportions from '../components/SellingProportions';
import {Categories} from '../components/Categories.jsx';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';


export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FancyFrame />
      <FeaturedProducts />
      <SellingProportions />
      <Categories />
      <FaqSection />
      <Footer />
    </>
  );
}