import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import banner1 from "@/assets/banner1.jpg";
import banner2 from "@/assets/banner2.jpg";
import banner3 from "@/assets/banner3.jpg";

const slides = [
  { image: banner1, title: "Farm Fresh Vegetables", subtitle: "Straight from the farm to your table", cta: "Shop Now" },
  { image: banner2, title: "Seasonal Fruits", subtitle: "Handpicked at peak ripeness", cta: "Explore" },
  { image: banner3, title: "Organic Greens", subtitle: "100% organic, 100% fresh", cta: "Order Today" },
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir: number) => setCurrent((p) => (p + dir + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[320px] md:h-[480px] lg:h-[560px] overflow-hidden rounded-b-3xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={slides[current].image} alt={slides[current].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground max-w-xl leading-tight"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-md"
              >
                {slides[current].subtitle}
              </motion.p>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                {slides[current].cta}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full hover:bg-card transition-colors shadow-lg">
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm p-2 rounded-full hover:bg-card transition-colors shadow-lg">
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-accent w-8" : "bg-primary-foreground/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
