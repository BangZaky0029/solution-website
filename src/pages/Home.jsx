
// =========================================
// FILE: src/pages/Home.jsx
// =========================================

import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Packages from '../components/sections/Packages';
import FAQ from '../components/sections/FAQ'; // Diubah dari ./Info/FAQ ke ../components/sections/FAQ
import CTA from '../components/sections/CTA';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Packages />
      <FAQ />
      <CTA />
    </div>
  );
};

export default Home;
