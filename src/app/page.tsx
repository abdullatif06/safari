"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import VisitJordan from "@/components/VisitJordan";
import StickyGallery from "@/components/StickyGallery";
import PlacesTeaser from "@/components/PlacesTeaser";
import {
  CategoryStrip,
  ThisWeekend,
  CityStrip,
  HowItWorks,
  MapTeaser,
  NewsletterCTA,
} from "@/components/HomeSections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {/* Places lead the experience — the site is now "places to go in Amman" */}
        <PlacesTeaser />
        {/* Real events up top — proves the site is full before anything else */}
        <ThisWeekend />
        {/* Big visual moment: thrown cards + sticky scenic gallery */}
        <StickyGallery />
        <CategoryStrip />
        <VisitJordan />
        {/* How it works moved down — out of the prime fold, paced after the wow */}
        <HowItWorks />
        <CityStrip />
        <MapTeaser />
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  );
}
