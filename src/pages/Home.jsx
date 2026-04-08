
// =========================================
// FILE: src/pages/Home.jsx
// =========================================

import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import CTA from '../components/sections/CTA';
import FeedbackShowcase from '../components/sections/FeedbackShowcase';

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      <CTA />
      <FeedbackShowcase />
    </div>
  );
};


export default Home;
