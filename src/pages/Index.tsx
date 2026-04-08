import { useState } from "react";
import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/TodaysMarketRates";
import WhyChooseUs from "@/components/WhyChooseUs";
import SemicircleFooter from "@/components/SemicircleFooter";
import FarmerStory from "@/components/FarmerStory";
import OnlineStore from "@/components/OnlineStore";
import Testimonials from "@/components/Testimonials";
import QuickReorder from "@/components/QuickReorder";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BannerSlider />
     <QuickReorder/>
      <Categories />
      <FeaturedProducts/>
      {/* <OnlineStore />
      <FarmerStory /> */}
      <WhyChooseUs />
      <Testimonials />
      <SemicircleFooter />
    </div>
  );
};

export default Index;
