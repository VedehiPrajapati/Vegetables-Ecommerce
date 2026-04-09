// import { Plus, Star, Loader2 } from "lucide-react";
// import { Product } from "@/data/products";
// import { useCartStore } from "@/store/cartStore";
// import { useAuthStore } from "@/store/authStore";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { Skeleton } from "@/components/ui/skeleton";

// export const ProductCardSkeleton = () => {
//   return (
//     <div className="card-product bg-card rounded-3xl overflow-hidden border border-border/50">
//       <div className="relative overflow-hidden aspect-square bg-secondary/10">
//         <Skeleton className="w-full h-full rounded-none" />
//       </div>
//       <div className="p-4 space-y-4">
//         <div className="space-y-2">
//           <div className="flex items-center justify-between gap-2">
//             <Skeleton className="h-3 w-16 rounded-full" />
//             <Skeleton className="h-3 w-8 rounded-full" />
//           </div>
//           <Skeleton className="h-5 w-3/4 rounded-full" />
//         </div>
//         <div className="flex items-end justify-between pt-2">
//           <div className="flex flex-col space-y-1.5">
//             <Skeleton className="h-3 w-10 rounded-full" />
//             <Skeleton className="h-6 w-20 rounded-full" />
//           </div>
//           <Skeleton className="h-8 w-8 rounded-xl md:hidden" />
//         </div>
//       </div>
//     </div>
//   );
// };

// const ProductCard = ({ product }: { product: Product }) => {
//   const addToCart = useCartStore((state) => state.addToCart);
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
//   const navigate = useNavigate();
//   const [isAdding, setIsAdding] = useState(false);

//   const handleAdd = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }

//     setIsAdding(true);
//     try {
//       await addToCart(product.id, 1);
//       toast.success(`${product.name} added to cart!`);
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to add to cart");
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       whileHover={{ y: -4 }}
//       className="card-product group cursor-pointer bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
//       onClick={() => navigate(`/product/${product.slug}`)}
//     >
//       {/* Image Area */}
//       <div className="relative overflow-hidden aspect-square bg-secondary/30">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
//         />

//         <div className="absolute top-3 left-3 flex flex-col gap-1.5">
//           {product.organic && (
//             <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border border-primary/20 uppercase tracking-wider">
//               Organic
//             </span>
//           )}
//           {product.originalPrice && product.originalPrice > product.price && (
//             <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
//               Sale
//             </span>
//           )}
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={handleAdd}
//           disabled={isAdding}
//           className="absolute bottom-3 right-3 bg-primary text-primary-foreground p-2.5 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
//         >
//           {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
//         </motion.button>
//       </div>

//       {/* Info Area */}
//       <div className="p-4 space-y-3">
//         <div className="space-y-1">
//           <div className="flex items-center justify-between gap-2">
//             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//               {product.category || "Produce"}
//             </span>
//             <div className="flex items-center gap-1 shrink-0">
//               <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//               <span className="text-[10px] font-bold text-foreground">
//                 {product.rating}
//               </span>
//             </div>
//           </div>
//           <h3 className="font-bold text-foreground text-sm md:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
//             {product.name}
//           </h3>
//         </div>

//         <div className="flex items-end justify-between">
//           <div className="flex flex-col">
//             {product.originalPrice && product.originalPrice > product.price && (
//               <span className="text-[10px] text-muted-foreground line-through font-medium">
//                 ₹{product.originalPrice}
//               </span>
//             )}
//             <div className="flex items-baseline gap-1">
//               <span className="text-xl font-black text-primary">₹{product.price}</span>
//               <span className="text-[10px] font-bold text-muted-foreground">/{product.unit || 'kg'}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleAdd}
//             disabled={isAdding}
//             className="md:hidden bg-primary text-primary-foreground p-2 rounded-xl shadow-md disabled:opacity-50"
//           >
//             {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ProductCard;

// import { useState } from "react";
// import { Plus, Minus, Loader2 } from "lucide-react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// import { Product } from "@/data/products";
// import { useCartStore } from "@/store/cartStore";
// import { useAuthStore } from "@/store/authStore";
// import { Skeleton } from "@/components/ui/skeleton";

// export const ProductCardSkeleton = () => {
//   return (
//     <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
//       <Skeleton className="w-full h-44 sm:h-48 md:h-52 lg:h-56 rounded-none" />

//       <div className="p-3 sm:p-4 space-y-4">
//         <Skeleton className="h-5 w-3/4 rounded-md" />
//         <Skeleton className="h-4 w-full rounded-md" />

//         <div className="grid grid-cols-2 gap-2 sm:gap-3">
//           <Skeleton className="h-16 rounded-lg" />
//           <Skeleton className="h-16 rounded-lg" />
//         </div>

//         <Skeleton className="h-12 rounded-lg" />
//         <Skeleton className="h-11 rounded-lg" />
//       </div>
//     </div>
//   );
// };

// const ProductCard = ({ product }: { product: Product }) => {
//   const addToCart = useCartStore((state) => state.addToCart);
//   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

//   const navigate = useNavigate();

//   const [isAdding, setIsAdding] = useState(false);

//   // Default bulk quantity
//   const [quantity, setQuantity] = useState(10);

//   const totalPrice = quantity * product.price;

//   const handleAdd = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       toast.error("Please login to add items to cart");
//       navigate("/login");
//       return;
//     }

//     setIsAdding(true);

//     try {
//       await addToCart(product.id, quantity);
//       toast.success(`${product.name} added to bulk cart!`);
//     } catch (error: any) {
//       toast.error(
//         error.response?.data?.message || "Failed to add to cart"
//       );
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -6 }}
//       viewport={{ once: true }}
//       onClick={() => navigate(`/product/${product.slug}`)}
//       className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
//     >
//       {/* Product Image */}
//       <div className="relative h-44 sm:h-48 md:h-52 lg:h-56 bg-gray-100 overflow-hidden">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
//         />

//         {/* MOQ Badge */}
//         <div className="absolute top-3 left-3">
//           <span className="bg-yellow-400 text-black text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-md shadow-sm">
//             MOQ: {quantity} kg
//           </span>
//         </div>
//       </div>

//       {/* Product Info */}
//       <div className="p-3 sm:p-4 space-y-4">
//         {/* Product Name */}
//         <div>
//           <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
//             {product.name}
//           </h3>

//           <p className="text-xs sm:text-sm text-gray-500 mt-1">
//             Premium Quality | Fresh Product
//           </p>
//         </div>

//         {/* Price Box */}
//         <div className="grid grid-cols-2 gap-2 sm:gap-3">
//           <div className="bg-green-50 rounded-lg p-2.5 sm:p-3">
//             <p className="text-[11px] sm:text-xs text-gray-500">
//               Today's Rate
//             </p>

//             <p className="text-lg sm:text-xl font-bold text-gray-900">
//               ₹{product.price}
//               <span className="text-xs sm:text-sm text-gray-500 font-medium">
//                 /kg
//               </span>
//             </p>
//           </div>

//           <div className="bg-green-50 rounded-lg p-2.5 sm:p-3 text-right">
//             <p className="text-[11px] sm:text-xs text-gray-500">
//               Est. Total
//             </p>

//             <p className="text-lg sm:text-xl font-bold text-gray-900">
//               ₹{totalPrice}
//             </p>
//           </div>
//         </div>

//         {/* Quantity Selector */}
//         <div className="border rounded-lg flex items-center justify-between px-3 py-2">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setQuantity((prev) => Math.max(1, prev - 1));
//             }}
//             className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
//           >
//             <Minus size={16} />
//           </button>

//           <span className="font-semibold text-base sm:text-lg">
//             {quantity} kg
//           </span>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setQuantity((prev) => prev + 1);
//             }}
//             className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
//           >
//             <Plus size={16} />
//           </button>
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={handleAdd}
//           disabled={isAdding}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-50"
//         >
//           {isAdding ? (
//             <div className="flex items-center justify-center gap-2">
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Adding...
//             </div>
//           ) : (
//             "Add to Bulk Cart"
//           )}
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default ProductCard;



import { useState } from "react";
import { Plus, Minus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <Skeleton className="w-full h-44 sm:h-48 md:h-52 lg:h-56 rounded-none" />

      <div className="p-3 sm:p-4 space-y-4">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>

        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-11 rounded-lg" />
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);

  // Default bulk quantity
  const [quantity, setQuantity] = useState(10);

  const totalPrice = quantity * product.price;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAdding(true);

    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to bulk cart!`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-36 sm:h-40 md:h-46 lg:h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* MOQ Badge */}
        <div className="absolute top-2 left-1">
          <span className="bg-yellow-400 text-black text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-md shadow-sm">
            MOQ: {quantity} kg
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-0.5 sm:p-1 space-y-1">
        {/* Product Name */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Premium Quality | Fresh Product
          </p>
        </div>

        {/* Price Box */}
        <div className="grid grid-cols-2 gap-1.5 px-2 py-1">
          {/* Today's Rate */}
          <div className="bg-green-50 rounded-lg p-1.5 flex flex-col justify-center">
            <p className="text-[9px] sm:text-xs text-gray-500 leading-none mb-0.5">
              Today's Rate
            </p>
            <p className="text-sm sm:text-lg font-bold text-gray-900 flex items-baseline">
              ₹{product.price}
              <span className="text-[8px] sm:text-xs text-gray-500 font-medium ml-0.5">
                /kg
              </span>
            </p>
          </div>

          {/* Est. Total */}
          <div className="bg-green-50 rounded-lg p-1.5 flex flex-col justify-center items-end text-right">
            <p className="text-[9px] sm:text-xs text-gray-500 leading-none mb-0.5">
              Est. Total
            </p>
            <p className="text-sm sm:text-lg font-bold text-gray-900">
              ₹{totalPrice}
            </p>
          </div>
        </div>


        {/* Quantity Selector */}
        <div className="border rounded-lg flex items-center justify-between px-1 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((prev) => Math.max(1, prev - 1));
            }}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <Minus size={10} />
          </button>

          <span className="font-semibold text-base sm:text-md">
            {quantity} kg
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuantity((prev) => prev + 1);
            }}
            className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <Plus size={10} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-0.5 sm:py-0.5 rounded-sm text-sm sm:text-base font-semibold transition-all duration-300 disabled:opacity-50"
        >
          {isAdding ? (
            <div className="flex items-center justify-center gap-1">
              <Loader2 className="w-2 h-2 animate-spin" />
              Adding...
            </div>
          ) : (
            "Add to Bulk Cart"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;