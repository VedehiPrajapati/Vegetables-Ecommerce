import { useState } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChooseUs from "@/components/WhyChooseUs";
import SemicircleFooter from "@/components/SemicircleFooter";
import FarmerStory from "@/components/FarmerStory";
import OnlineStore from "@/components/OnlineStore";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BannerSlider />
      <Categories selected={selectedCategory} onSelect={setSelectedCategory} />
      <FeaturedProducts selectedCategory={selectedCategory} />
      <OnlineStore />
      <FarmerStory />
      <WhyChooseUs />
      <SemicircleFooter />
    </div>
  );
};

export default Index;
