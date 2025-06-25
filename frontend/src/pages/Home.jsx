import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <Categories />
      <FaqSection />
      <Footer />
    </>
  );
}