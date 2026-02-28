import { useParams, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, ShoppingCart, Leaf, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/services/api";
import SemicircleFooter from "@/components/SemicircleFooter";
import Header from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [currentMainImage, setCurrentMainImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.data;
        if (!p) throw new Error("Product not found");

        setProduct({
          id: p._id,
          slug: p.slug,
          name: p.name,
          price: p.offerPrice,
          originalPrice: p.originalPrice,
          category: p.category?.name,
          image: p.mainImage?.secure_url,
          unit: p.unit,
          description: p.description,
          organic: true,
          rating: 4.5,
          discount: Math.round(((p.originalPrice - p.offerPrice) / p.originalPrice) * 100)
        });

        setCurrentMainImage(p.mainImage?.secure_url);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
          <div className="border-b border-border">
            <div className="container mx-auto px-4 py-4 flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <ChevronRight className="w-3 h-3 text-border flex-shrink-0" />
              <Skeleton className="h-4 w-20" />
              <ChevronRight className="w-3 h-3 text-border flex-shrink-0" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 py-6 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7 xl:col-span-6 flex flex-col md:flex-row gap-4">
                <div className="flex md:flex-col gap-3 order-2 md:order-1">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl" />
                  ))}
                </div>
                <div className="relative flex-1 aspect-square md:aspect-auto md:h-[500px] bg-card rounded-3xl overflow-hidden border border-border flex items-center justify-center order-1 md:order-2">
                  <Skeleton className="w-full h-full rounded-none" />
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
                <div className="space-y-3">
                  <Skeleton className="h-10 sm:h-12 w-3/4 rounded-2xl" />
                  <Skeleton className="h-5 w-1/3 rounded-full" />
                </div>

                <div className="space-y-2 pt-4">
                  <Skeleton className="h-16 w-1/2 rounded-2xl" />
                </div>

                <hr className="border-border my-6" />

                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-14 w-full sm:w-40 rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Skeleton className="h-[74px] rounded-xl" />
                  <Skeleton className="h-[74px] rounded-xl" />
                </div>

                <div className="pt-4 space-y-3">
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-5/6 rounded-full" />
                  <Skeleton className="h-4 w-4/6 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <SemicircleFooter />
      </>
    );
  }

  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-destructive">Product not found.</div>;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity}x ${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const productImages = [product.image].filter(Boolean); // Backend currently provides single image

  return (
    <>
      <Header />
      <div className="bg-background text-foreground transition-colors duration-300 min-h-screen">
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-xs sm:text-sm opacity-70 overflow-x-auto whitespace-nowrap no-scrollbar">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/')}>Home</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="hover:text-primary cursor-pointer transition-colors">{product.category}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="font-semibold text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7 xl:col-span-6 flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
                {productImages.map((imgUrl, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentMainImage(imgUrl)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 ${currentMainImage === imgUrl ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <img src={imgUrl} alt={`thumbnail-${i}`} className={`w-full h-full object-cover ${currentMainImage === imgUrl ? 'opacity-100' : 'opacity-60'}`} />
                  </motion.div>
                ))}
              </div>

              <div className="relative flex-1 aspect-square md:aspect-auto md:h-[500px] bg-card rounded-3xl overflow-hidden border border-border flex items-center justify-center order-1 md:order-2">
                {product.discount > 0 && (
                  <div className="absolute top-0 left-0 bg-primary text-primary-foreground px-4 py-1.5 sm:px-6 sm:py-2 rounded-br-2xl font-bold text-base sm:text-xl z-10 shadow-lg">
                    {product.discount}% Off
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentMainImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    src={currentMainImage!}
                    alt={product.name}
                    className="w-[85%] h-[85%] object-contain mix-blend-multiply drop-shadow-xl"
                  />
                </AnimatePresence>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-6 flex flex-col justify-center space-y-6 md:space-y-8">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="text-sm opacity-60 font-medium">(4.8 / 5 Customer Rating)</span>
                </div>
              </div>

              <div className="space-y-1">
                {product.originalPrice > product.price && (
                  <span className="text-xl sm:text-2xl opacity-40 line-through decoration-destructive/60 font-medium">₹{product.originalPrice}</span>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl sm:text-6xl font-black text-primary tracking-tighter">₹{product.price}</span>
                  <span className="text-lg font-semibold opacity-60">/ {product.unit || 'kg'}</span>
                </div>
              </div>

              <hr className="border-border" />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center justify-between border-2 border-border rounded-2xl px-4 py-3 bg-secondary/50 backdrop-blur-sm sm:w-40">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-background rounded-lg transition-colors"><Minus className="w-5 h-5" /></button>
                  <span className="text-xl font-bold min-w-[30px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-background rounded-lg transition-colors"><Plus className="w-5 h-5" /></button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-primary text-primary-foreground py-4 sm:py-0 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 font-bold text-lg transition-all hover:bg-primary/90 disabled:opacity-70"
                >
                  {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShoppingCart className="w-6 h-6" />}
                  Add to Cart
                </motion.button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Leaf className="w-5 h-5" /></div>
                  <span className="text-sm font-bold">100% Organic</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl border border-border/50">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">✓</div>
                  </div>
                  <span className="text-sm font-bold">Quality Checked</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {product.description || "Freshly sourced and packed with nutrients. This organic selection is perfect for maintaining a healthy lifestyle."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SemicircleFooter />
    </>
  );
};

export default ProductDetail;

