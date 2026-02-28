import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const farmers = [
  {
    name: "SURAJ KAILAS MULAY",
    farm: "Mulay Farms",
    location: "Pune, Maharashtra",
    image:
      "https://ik.imagekit.io/44y3v51cp/kisankonnect/Images/KisanCommunityImage/20250918131211Farmer_20250909150415.jpg?tr=f-webp",
    story: "I am a progressive farmer from Pune. I grow fruits and vegetables using modern farming methods.",
  },
  {
    name: "WALE KIRAN ARJUN",
    farm: "Wale Farms",
    location: "Ahilyanagar, Maharashtra",
    image:
      "https://ik.imagekit.io/44y3v51cp/kisankonnect/Images/KisanCommunityImage/20230602114657Farmer%20Image.jpg?tr=f-webp",
    story: "Farming is our family tradition. We focus on organic and sustainable practices.",
  },
  {
    name: "SANTOSH SHIVAJI GADAKH",
    farm: "Athave Rasta",
    location: "Nashik, Maharashtra",
    image:
      "https://ik.imagekit.io/44y3v51cp/kisankonnect/Images/KisanCommunityImage/20230602115814Farmer%20Image.jpg?tr=f-webp",
    story: "We specialize in grapes and pomegranates with high quality production.",
  },
  {
    name: "SATISH CHANDRABHAN IKHE",
    farm: "Karevasti Farms",
    location: "Nashik, Maharashtra",
    image:
      "https://ik.imagekit.io/44y3v51cp/kisankonnect/Images/KisanCommunityImage/2025091812530520240721104751IMG_20240721_10262811.jpg?tr=f-webp",
    story: "We practice both traditional and modern techniques to ensure better yield.",
  },
  {
    name: "PAVITRAK FARMER PRODUCER COMPANY",
    farm: "Samir Dombe",
    location: "Pune, Maharashtra",
    image:
      "https://ik.imagekit.io/44y3v51cp/kisankonnect/Images/KisanCommunityImage/20230602114657Farmer%20Image.jpg?tr=f-webp",
    story: "Our farmer producer company supports multiple farmers in the region.",
  },
];

// Product Banner Images
const productBanners = [
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
  "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
  "https://images.unsplash.com/photo-1574226516831-e1dff420e43e",
];

const extendedFarmers = [...farmers, ...farmers];

const KisanCommunity = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [bannerIndex, setBannerIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  // CARD AUTO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current >= farmers.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrent(0);
      }, 700);

      setTimeout(() => {
        setIsTransitioning(true);
      }, 750);
    }
  }, [current]);

  // PRODUCT BANNER AUTO SLIDER
  useEffect(() => {
    if (selectedFarmer) {
      const bannerInterval = setInterval(() => {
        setBannerIndex((prev) =>
          prev === productBanners.length - 1 ? 0 : prev + 1
        );
      }, 3000);

      return () => clearInterval(bannerInterval);
    }
  }, [selectedFarmer]);

  // ==============================
  // STORY PAGE VIEW
  // ==============================
  if (selectedFarmer) {
    return (
      <section className="bg-gray-100 min-h-screen pb-20">

        {/* TOP PRODUCT AUTO BANNER */}
        <div className="relative w-full h-[400px] overflow-hidden">
          <img
            src={productBanners[bannerIndex]}
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-start px-20">
            <h1 className="text-white text-4xl font-bold">
              Farm Fresh Products
            </h1>
          </div>
        </div>

        {/* Farmer Info Section */}
        <div className="container mx-auto px-6 mt-16">

          <button
            onClick={() => setSelectedFarmer(null)}
            className="mb-6 text-green-700 underline"
          >
            ← Back
          </button>

          <div className="flex flex-col md:flex-row gap-12 items-start">

            {/* Image */}
            <div className="border border-green-600 rounded-xl p-4">
              <img
                src={selectedFarmer.image}
                className="w-64 h-64 object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div>
              <h2 className="text-3xl font-bold border-b-2 border-green-600 pb-2">
                {selectedFarmer.name}
              </h2>

              <p className="mt-4">
                <strong>Farm:</strong> {selectedFarmer.farm}
              </p>

              <p className="mt-2">
                <strong>Location:</strong> {selectedFarmer.location}
              </p>

              <p className="mt-6 text-gray-700 leading-relaxed max-w-2xl">
                {selectedFarmer.story}
              </p>
            </div>

          </div>
        </div>
      </section>
    );
  }

  // ==============================
  // MAIN SLIDER PAGE
  // ==============================
  return (
    <section className="py-16 bg-[#f4f4f4]">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
          Kisan Community
        </h2>

        <div className="overflow-hidden p-16">
          <div
            ref={sliderRef}
            className="flex"
            style={{
              transform: `translateX(-${current * 320}px)`,
              transition: isTransitioning
                ? "transform 0.7s ease-in-out"
                : "none",
            }}
          >
            {extendedFarmers.map((farmer, index) => (
              <motion.div
                key={index}
                className="relative bg-[#e8e3d3] rounded-2xl shadow-md border border-green-500 pt-16 pb-8 px-6 text-center hover:shadow-lg transition mx-4 min-w-[280px]"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-32 h-32 rounded-full object-cover border-2 border-green-600 shadow"
                  />
                </div>

                <h3 className="font-bold text-sm md:text-base mt-6">
                  {farmer.name}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  {farmer.farm}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  ({farmer.location})
                </p>

                <button
                  onClick={() => setSelectedFarmer(farmer)}
                  className="mt-6 bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-md text-sm transition"
                >
                  View My Story
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#"
            className="text-green-700 font-medium underline hover:text-green-800"
          >
            View All...
          </a>
        </div>
      </div>
    </section>
  );
};

export default KisanCommunity;