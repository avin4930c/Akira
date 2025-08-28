'use client'

import Navigation from '@/components/common/Navigation';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import Footer from '@/components/common/Footer';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <HeroSection />

      <ProductsSection />

      <BenefitsSection />

      <Footer />
    </div>
  );
}