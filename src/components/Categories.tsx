// import { categories } from "@/data/products";
// import { motion } from "framer-motion";

// type Props = {
//   selected: string;
//   onSelect: (id: string) => void;
// };

// const Categories = ({ selected, onSelect }: Props) => {
//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <h2 className="section-title text-center mb-8">Shop by Category</h2>
//         <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
//           {categories.map((cat, i) => (
//             <motion.button
//               key={cat.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.08 }}
//               onClick={() => onSelect(selected === cat.id ? "" : cat.id)}
//               className={`flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl transition-all duration-300 border-2 ${
//                 selected === cat.id
//                   ? "border-primary bg-primary/10 shadow-lg"
//                   : "border-transparent bg-gradient-to-b " + cat.color + " hover:border-primary/30 hover:shadow-md"
//               }`}
//             >
//               <span className="text-3xl md:text-4xl">{cat.emoji}</span>
//               <span className="text-sm font-semibold text-foreground">{cat.name}</span>
//             </motion.button>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Categories;



// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import api from "@/services/api";
// import { Skeleton } from "@/components/ui/skeleton";

// type Props = {
//   selected: string;
//   onSelect: (id: string) => void;
// };

// // Map backend names to emojis/colors (optional fallback)
// const categoryMeta: Record<string, { emoji: string; color: string }> = {
//   "Vegetables": { emoji: "🥦", color: "from-green-50 to-emerald-50" },
//   "Fruits": { emoji: "🍎", color: "from-red-50 to-orange-50" },
//   "Leafy Greens": { emoji: "🥬", color: "from-green-50 to-teal-50" },
//   "Exotic": { emoji: "🥑", color: "from-emerald-50 to-green-50" },
//   "Root Vegetables": { emoji: "🥔", color: "from-orange-50 to-yellow-50" },
//   "Organic": { emoji: "🌿", color: "from-green-50 to-green-100" },
// };

// const containerVariants = {
//   hidden: {},
//   show: {
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30, scale: 0.9 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { type: "spring", stiffness: 120, damping: 14 },
//   },
// };

// const Categories = ({ selected, onSelect }: Props) => {
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("/categories");
//         setCategories(response.data.data);
//       } catch (error) {
//         console.error("Fetch categories error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-10 md:py-14">
//         <div className="container mx-auto px-4 md:px-6">
//           <h2 className="section-title text-center mb-8">Shop by Category</h2>
//           <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
//             {Array.from({ length: 6 }).map((_, i) => (
//               <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 md:p-6 rounded-2xl border-2 border-transparent bg-secondary/20 animate-pulse">
//                 <Skeleton className="w-10 h-10 rounded-full" />
//                 <Skeleton className="w-16 h-4 rounded-md" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-10 md:py-14">
//       <div className="container mx-auto px-4 md:px-6">
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="section-title text-center mb-8"
//         >
//           Shop by Category
//         </motion.h2>

//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//           className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4"
//         >
//           {categories.map((cat) => {
//             const isSelected = selected === cat._id;
//             const meta = categoryMeta[cat.name] || { emoji: "🥗", color: "from-gray-50 to-white" };

//             return (
//               <motion.button
//                 key={cat._id}
//                 variants={itemVariants}
//                 layout
//                 whileHover={{ y: -6, rotate: -1, scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 animate={isSelected ? { scale: 1.1, boxShadow: "0px 15px 35px rgba(0,0,0,0.15)" } : { scale: 1 }}
//                 transition={{ type: "spring", stiffness: 200, damping: 15 }}
//                 onClick={() => onSelect(isSelected ? "" : cat._id)}
//                 className={`relative flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl border-2 transition-colors ${isSelected
//                   ? "border-primary bg-primary/10"
//                   : "border-transparent bg-gradient-to-b " + meta.color + " hover:border-primary/30"
//                   }`}
//               >
//                 <motion.span
//                   animate={{ rotate: isSelected ? 360 : 0 }}
//                   transition={{ duration: 0.6 }}
//                   className="text-3xl md:text-4xl"
//                 >
//                   {meta.emoji}
//                 </motion.span>

//                 <span className="text-sm font-semibold text-foreground">
//                   {cat.name}
//                 </span>

//                 {isSelected && (
//                   <motion.div
//                     layoutId="categoryGlow"
//                     className="absolute inset-0 rounded-2xl ring-2 ring-primary/40"
//                   />
//                 )}
//               </motion.button>
//             );
//           })}
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default Categories;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import fruitsImg from "@/assets/categories/fruits.jpg";
import vegetablesImg from "@/assets/categories/vegetablesImg.png";
import rootImg from "@/assets/categories/Root.png";
import ExoticImg from "@/assets/categories/exotic.png";
import leafyImg from "@/assets/categories/leafy.png";
import DailyStaplesImg from "@/assets/categories/DailyStaples.jpg";
import allImg from "@/assets/categories/leafy.png";

type Props = {
  selected?: string;
};

const categoryImages: Record<string, string> = {
  "Fresh Fruits": fruitsImg,
  "Seasonal Vegetables": vegetablesImg,
  "Leafy Greens": leafyImg,
  "Exotic Vegetables": ExoticImg,
  "Root Vegetables": rootImg,
  "Daily Staples": DailyStaplesImg,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 16 },
  },
};

const Categories = ({ selected }: Props) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Fetch categories error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = (categoryId: string) => {
  navigate(`/products?category=${categoryId}`);
};
  if (loading) {
    return (
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-1 h-10 bg-primary rounded-full mt-1" />
            <div>
              <Skeleton className="w-44 h-6 rounded-md mb-2" />
              <Skeleton className="w-64 h-4 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border bg-white shadow-sm"
              >
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-20 h-3.5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const allItems = categories.map((cat) => ({
  ...cat,
  image: categoryImages[cat.name] || fruitsImg,
}));

  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-start gap-3"
        >
          <div className="w-1 h-10 bg-primary rounded-full mt-1 shrink-0" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Browse by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Explore our full range of wholesale fresh produce.
            </p>
          </div>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5"
        >
          {allItems.map((cat) => {
            const isActive = selected === cat._id;

            return (
              <motion.button
                key={cat._id}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                  transition: { type: "spring", stiffness: 260, damping: 18 },
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelect(cat._id)}
                className={`
                  group relative flex flex-col items-center text-center gap-3
                  px-3 py-5 rounded-2xl border transition-colors duration-200
                  ${
                    isActive
                      ? "border-primary/50 bg-primary/5"
                      : "border-gray-100 bg-white hover:border-primary/30 hover:bg-gray-50/80"
                  }
                `}
              >
                {/* Image circle */}
                <div
                  className={`
                    w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden
                    ring-2 transition-all duration-200
                    ${
                      isActive
                        ? "ring-primary/40 shadow-md"
                        : "ring-gray-100 group-hover:ring-primary/25 group-hover:shadow-md"
                    }
                  `}
                >
                  <motion.img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-xs md:text-sm font-medium leading-tight transition-colors duration-200
                    ${isActive ? "text-primary" : "text-gray-700 group-hover:text-gray-900"}
                  `}
                >
                  {cat.name}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories 