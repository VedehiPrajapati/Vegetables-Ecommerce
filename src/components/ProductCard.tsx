import { Plus, Star, Loader2 } from "lucide-react";
import { Product } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => {
  return (
    <div className="card-product bg-card rounded-3xl overflow-hidden border border-border/50">
      <div className="relative overflow-hidden aspect-square bg-secondary/10">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="h-3 w-8 rounded-full" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-full" />
        </div>
        <div className="flex items-end justify-between pt-2">
          <div className="flex flex-col space-y-1.5">
            <Skeleton className="h-3 w-10 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl md:hidden" />
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="card-product group cursor-pointer bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
      onClick={() => navigate(`/product/${product.slug}`)}
    >
      {/* Image Area */}
      <div className="relative overflow-hidden aspect-square bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.organic && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border border-primary/20 uppercase tracking-wider">
              Organic
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              Sale
            </span>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleAdd}
          disabled={isAdding}
          className="absolute bottom-3 right-3 bg-primary text-primary-foreground p-2.5 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/90 disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Info Area */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {product.category || "Produce"}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-foreground">
                {product.rating}
              </span>
            </div>
          </div>
          <h3 className="font-bold text-foreground text-sm md:text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] text-muted-foreground line-through font-medium">
                ₹{product.originalPrice}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary">₹{product.price}</span>
              <span className="text-[10px] font-bold text-muted-foreground">/{product.unit || 'kg'}</span>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="md:hidden bg-primary text-primary-foreground p-2 rounded-xl shadow-md disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
