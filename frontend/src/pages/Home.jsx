import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FancyFrame from "../components/FancyFrame.jsx";
import FeaturedProducts from '../components/FeaturedProducts';
import SellingProportions from '../components/SellingProportions';
import { Categories } from '../components/Categories.jsx';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';

// Reusable animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export default function Home() {
  return (
    <>
      <Navbar />

      <motion.div {...fadeInUp}>
        <HeroSection />
      </motion.div>

      <motion.div {...fadeInUp}>
        <FancyFrame />
      </motion.div>

      <motion.div {...fadeInUp}>
        <FeaturedProducts />
      </motion.div>

      <motion.div {...fadeInUp}>
        <SellingProportions />
      </motion.div>

      <motion.div {...fadeInUp}>
        <Categories />
      </motion.div>

      <motion.div {...fadeInUp}>
        <FaqSection />
      </motion.div>

      <motion.div {...fadeInUp}>
        <Footer />
      </motion.div>
    </>
  );
}