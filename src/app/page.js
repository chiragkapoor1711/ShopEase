import React from 'react'
import Hero from "@/components/Hero";
import FeaturedCategories from '@/components/FeaturedCategories';
import FeaturedProducts from '@/components/FeaturedProducts';
import PromoBanner from '@/components/PromoBanner';
import WhyChooseUs from '@/components/WhyChooseUs';

export default function page() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      {/* <FeaturedProducts/> */}
      <PromoBanner/>
      <WhyChooseUs/>
    </div>
  )
}
