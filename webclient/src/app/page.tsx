'use client'

import Navigation from '@/components/common/Navigation';
import HeroSection from '@/components/home/HeroSection';
import ProductsSection from '@/components/home/ProductsSection';
import TechStackSection from '@/components/home/TechStackSection';
import ArchitectureSection from '@/components/home/ArchitectureSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import Footer from '@/components/common/Footer';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background dark">
      <Navigation />

      <HeroSection />

      <ProductsSection />

      <TechStackSection />

      <ArchitectureSection />

      <BenefitsSection />

      <Footer />
    </div>
  );
}