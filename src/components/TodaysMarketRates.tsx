// import { useEffect, useState, useRef, useCallback } from "react";
// import ProductCard, { ProductCardSkeleton } from "./ProductCard";
// import api from "@/services/api";
// import type { Product } from "@/data/products";
// import { useNavigate } from "react-router-dom";

// type Category = { _id: string; name: string };

// const VISIBLE_CARDS = 2;
// const AUTO_SLIDE_INTERVAL = 3000;
// const DRAG_THRESHOLD = 40;

// const FeaturedProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const ITEMS_LIMIT = 5;

//   // Carousel state
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragOffset, setDragOffset] = useState(0);
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const dragStartX = useRef(0);
//   const dragStartSlide = useRef(0);
//   const trackRef = useRef<HTMLDivElement>(null);

//   const totalPages = Math.max(0, products.length - VISIBLE_CARDS + 1);

//   const startAutoSlide = useCallback(() => {
//     stopAutoSlide();
//     if (totalPages <= 1) return;
//     timerRef.current = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % totalPages);
//     }, AUTO_SLIDE_INTERVAL);
//   }, [totalPages]);

//   const stopAutoSlide = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   const goToSlide = useCallback(
//     (index: number) => {
//       const clamped = Math.max(0, Math.min(index, totalPages - 1));
//       setCurrentSlide(clamped);
//     },
//     [totalPages]
//   );

//   // Restart auto-slide whenever totalPages updates
//   useEffect(() => {
//     startAutoSlide();
//     return stopAutoSlide;
//   }, [startAutoSlide]);

//   // ── Touch handlers ──
//   const handleTouchStart = (e: React.TouchEvent) => {
//     stopAutoSlide();
//     setIsDragging(true);
//     dragStartX.current = e.touches[0].clientX;
//     dragStartSlide.current = currentSlide;
//     setDragOffset(0);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isDragging) return;
//     const delta = e.touches[0].clientX - dragStartX.current;
//     setDragOffset(delta);
//   };

//   const handleTouchEnd = () => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     if (dragOffset < -DRAG_THRESHOLD) {
//       goToSlide(dragStartSlide.current + 1);
//     } else if (dragOffset > DRAG_THRESHOLD) {
//       goToSlide(dragStartSlide.current - 1);
//     } else {
//       goToSlide(dragStartSlide.current);
//     }
//     setDragOffset(0);
//     setTimeout(startAutoSlide, 300);
//   };

//   // ── Mouse drag handlers (desktop carousel if ever used) ──
//   const handleMouseDown = (e: React.MouseEvent) => {
//     stopAutoSlide();
//     setIsDragging(true);
//     dragStartX.current = e.clientX;
//     dragStartSlide.current = currentSlide;
//     setDragOffset(0);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging) return;
//     const delta = e.clientX - dragStartX.current;
//     setDragOffset(delta);
//   };

//   const handleMouseUp = () => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     if (dragOffset < -DRAG_THRESHOLD) {
//       goToSlide(dragStartSlide.current + 1);
//     } else if (dragOffset > DRAG_THRESHOLD) {
//       goToSlide(dragStartSlide.current - 1);
//     } else {
//       goToSlide(dragStartSlide.current);
//     }
//     setDragOffset(0);
//     setTimeout(startAutoSlide, 300);
//   };

//   // Card width = 50% of container, gap = 10px (2.5 * 4)
//   const cardWidthPercent = 50;
//   const gapPx = 10;
//   // translateX per slide = -(cardWidth% + gapPx) relative to container
//   // We compute this as a CSS calc expression
//   const baseTranslate = `calc(-${currentSlide} * (${cardWidthPercent}% + ${gapPx}px))`;
//   const dragTranslate = isDragging ? `${dragOffset}px` : "0px";

//   const transition = isDragging
//     ? "none"
//     : "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)";

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get("/categories");
//         setCategories(res.data.data ?? []);
//       } catch (err) {
//         console.error("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const url = selectedCategory
//           ? `/products?category=${selectedCategory._id}`
//           : `/products`;
//         const res = await api.get(url);
//         const productsArray = res.data.data ?? [];
//         const mappedProducts: Product[] = productsArray.map((p: any) => ({
//           id: p._id,
//           slug: p.slug,
//           name: p.name,
//           price: p.offerPrice,
//           originalPrice: p.originalPrice,
//           category: p.category?.name,
//           image: p.mainImage?.secure_url,
//           unit: p.unit,
//           description: p.description,
//           organic: true,
//           rating: 4.5,
//         }));
//         setProducts(mappedProducts.slice(0, ITEMS_LIMIT));
//         setCurrentSlide(0);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [selectedCategory]);

//   if (loading) {
//     return (
//       <section id="products" className="py-6 md:py-14">
//         <div className="container mx-auto px-3 md:px-6">
//           <div className="bg-gray-100 rounded-xl p-3 md:p-5 mb-5 md:mb-8 animate-pulse">
//             <div className="flex items-center justify-between gap-3">
//               <div className="h-5 w-36 md:h-6 md:w-48 bg-gray-300 rounded" />
//               <div className="h-7 w-20 bg-gray-300 rounded-full" />
//             </div>
//             <div className="flex gap-2 mt-3 flex-nowrap overflow-hidden">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="h-7 w-20 flex-shrink-0 bg-gray-300 rounded-full" />
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-4">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <ProductCardSkeleton key={i} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section id="products" className="py-8 text-center text-destructive text-sm px-4">
//         {error}
//       </section>
//     );
//   }

//   return (
//     <section id="products" className="py-6 md:py-14">
//       <div className="container mx-auto px-3 md:px-6">

//         {/* Header Card */}
//         <div className="bg-gray-100 rounded-xl pl-1 pr-3 py-3 md:pl-2 md:pr-5 md:py-5 mb-5 md:mb-8">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 min-w-0">
//               <div className="w-1 h-7 md:h-10 bg-primary rounded-full flex-shrink-0" />
//               <h2 className="text-base md:text-2xl font-semibold text-gray-800 truncate leading-tight">
//                 {selectedCategory ? selectedCategory.name : "Today's Market Rates"}
//               </h2>
//             </div>
//             <button
//               onClick={() =>
//                 navigate(
//                   selectedCategory
//                     ? `/products?category=${selectedCategory._id}`
//                     : "/products"
//                 )
//               }
//               className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/30 bg-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm"
//             >
//               <span className="text-xs md:text-sm font-medium text-primary group-hover:text-white transition-colors duration-200 whitespace-nowrap">
//                 View All
//               </span>
//               <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </span>
//             </button>
//           </div>

//           <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 overflow-x-auto md:flex-wrap pb-0.5 md:pb-0 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
//             <button
//               onClick={() => setSelectedCategory(null)}
//               className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
//                 !selectedCategory ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
//               }`}
//             >
//               All Items
//             </button>
//             {categories.map((cat) => (
//               <button
//                 key={cat._id}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
//                   selectedCategory?._id === cat._id ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Products */}
//         {products.length === 0 ? (
//           <p className="text-center text-muted-foreground text-sm py-10">
//             No products found in this category.
//           </p>
//         ) : (
//           <>
//             {/* ── MOBILE: Smooth drag + auto-sliding carousel ── */}
//             <div className="block lg:hidden">
//               <div
//                 className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
//                 ref={trackRef}
//                 onTouchStart={handleTouchStart}
//                 onTouchMove={handleTouchMove}
//                 onTouchEnd={handleTouchEnd}
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//               >
//                 <div
//                   className="flex gap-2.5"
//                   style={{
//                     transform: `translateX(calc(${baseTranslate} + ${dragTranslate}))`,
//                     transition,
//                     willChange: "transform",
//                   }}
//                 >
//                   {products.map((product) => (
//                     <div
//                       key={product.id}
//                       className="flex-shrink-0 w-[calc(50%-5px)]"
//                       // prevent drag from triggering card clicks
//                       onClickCapture={(e) => {
//                         if (Math.abs(dragOffset) > 5) e.stopPropagation();
//                       }}
//                     >
//                       <ProductCard product={product} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Dot indicators */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center items-center gap-1.5 mt-4">
//                   {Array.from({ length: totalPages }).map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         goToSlide(i);
//                         stopAutoSlide();
//                         setTimeout(startAutoSlide, AUTO_SLIDE_INTERVAL);
//                       }}
//                       aria-label={`Go to slide ${i + 1}`}
//                       className={`rounded-full transition-all duration-300 ease-out ${
//                         i === currentSlide
//                           ? "w-5 h-1.5 bg-primary"
//                           : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ── DESKTOP: 5-column grid ── */}
//             <div className="hidden lg:grid grid-cols-5 gap-4">
//               {products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;

// import { useEffect, useState, useRef, useCallback } from "react";
// import ProductCard, { ProductCardSkeleton } from "./ProductCard";
// import api from "@/services/api";
// import type { Product } from "@/data/products";
// import { useNavigate } from "react-router-dom";

// type Category = { _id: string; name: string };

// const MOBILE_VISIBLE = 2;
// const DESKTOP_VISIBLE = 5;
// const AUTO_SLIDE_INTERVAL = 3000;
// const DRAG_THRESHOLD = 40;

// const FeaturedProducts = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Separate slide state for mobile and desktop
//   const [mobileSlide, setMobileSlide] = useState(0);
//   const [desktopSlide, setDesktopSlide] = useState(0);

//   const [mobileDragging, setMobileDragging] = useState(false);
//   const [desktopDragging, setDesktopDragging] = useState(false);
//   const [mobileDragOffset, setMobileDragOffset] = useState(0);
//   const [desktopDragOffset, setDesktopDragOffset] = useState(0);

//   const mobileDragStartX = useRef(0);
//   const desktopDragStartX = useRef(0);
//   const mobileDragStartSlide = useRef(0);
//   const desktopDragStartSlide = useRef(0);

//   const mobileTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const desktopTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const mobileTotalPages = Math.max(0, products.length - MOBILE_VISIBLE + 1);
//   const desktopTotalPages = Math.max(0, products.length - DESKTOP_VISIBLE + 1);

//   // ── Timer helpers ──
//   const stopTimer = (ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>) => {
//     if (ref.current) { clearInterval(ref.current); ref.current = null; }
//   };

//   const startMobileTimer = useCallback(() => {
//     stopTimer(mobileTimerRef);
//     if (mobileTotalPages <= 1) return;
//     mobileTimerRef.current = setInterval(() => {
//       setMobileSlide((p) => (p + 1) % mobileTotalPages);
//     }, AUTO_SLIDE_INTERVAL);
//   }, [mobileTotalPages]);

//   const startDesktopTimer = useCallback(() => {
//     stopTimer(desktopTimerRef);
//     if (desktopTotalPages <= 1) return;
//     desktopTimerRef.current = setInterval(() => {
//       setDesktopSlide((p) => (p + 1) % desktopTotalPages);
//     }, AUTO_SLIDE_INTERVAL);
//   }, [desktopTotalPages]);

//   useEffect(() => { startMobileTimer(); return () => stopTimer(mobileTimerRef); }, [startMobileTimer]);
//   useEffect(() => { startDesktopTimer(); return () => stopTimer(desktopTimerRef); }, [startDesktopTimer]);

//   // ── Slide clamp helpers ──
//   const goMobile = useCallback(
//     (i: number) => setMobileSlide(Math.max(0, Math.min(i, mobileTotalPages - 1))),
//     [mobileTotalPages]
//   );
//   const goDesktop = useCallback(
//     (i: number) => setDesktopSlide(Math.max(0, Math.min(i, desktopTotalPages - 1))),
//     [desktopTotalPages]
//   );

//   // ── Mobile touch handlers ──
//   const onMobileTouchStart = (e: React.TouchEvent) => {
//     stopTimer(mobileTimerRef);
//     setMobileDragging(true);
//     mobileDragStartX.current = e.touches[0].clientX;
//     mobileDragStartSlide.current = mobileSlide;
//     setMobileDragOffset(0);
//   };
//   const onMobileTouchMove = (e: React.TouchEvent) => {
//     if (!mobileDragging) return;
//     setMobileDragOffset(e.touches[0].clientX - mobileDragStartX.current);
//   };
//   const onMobileTouchEnd = () => {
//     if (!mobileDragging) return;
//     setMobileDragging(false);
//     if (mobileDragOffset < -DRAG_THRESHOLD) goMobile(mobileDragStartSlide.current + 1);
//     else if (mobileDragOffset > DRAG_THRESHOLD) goMobile(mobileDragStartSlide.current - 1);
//     else goMobile(mobileDragStartSlide.current);
//     setMobileDragOffset(0);
//     setTimeout(startMobileTimer, 300);
//   };

//   // ── Desktop mouse drag handlers ──
//   const onDesktopMouseDown = (e: React.MouseEvent) => {
//     stopTimer(desktopTimerRef);
//     setDesktopDragging(true);
//     desktopDragStartX.current = e.clientX;
//     desktopDragStartSlide.current = desktopSlide;
//     setDesktopDragOffset(0);
//   };
//   const onDesktopMouseMove = (e: React.MouseEvent) => {
//     if (!desktopDragging) return;
//     setDesktopDragOffset(e.clientX - desktopDragStartX.current);
//   };
//   const onDesktopMouseUp = () => {
//     if (!desktopDragging) return;
//     setDesktopDragging(false);
//     if (desktopDragOffset < -DRAG_THRESHOLD) goDesktop(desktopDragStartSlide.current + 1);
//     else if (desktopDragOffset > DRAG_THRESHOLD) goDesktop(desktopDragStartSlide.current - 1);
//     else goDesktop(desktopDragStartSlide.current);
//     setDesktopDragOffset(0);
//     setTimeout(startDesktopTimer, 300);
//   };

//   // ── Shared CSS transform builder ──
//   const makeStyle = (
//     slide: number,
//     dragging: boolean,
//     dragOffset: number,
//     visibleCards: number,
//     gapPx: number
//   ) => {
//     const cardPct = 100 / visibleCards;
//     return {
//       transform: `translateX(calc(-${slide} * (${cardPct}% + ${gapPx}px) + ${dragging ? dragOffset : 0}px))`,
//       transition: dragging ? "none" : "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
//       willChange: "transform" as const,
//     };
//   };

//   // ── Data fetching ──
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await api.get("/categories");
//         setCategories(res.data.data ?? []);
//       } catch (err) {
//         console.error("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError("");
//         const url = selectedCategory
//           ? `/products?category=${selectedCategory._id}`
//           : `/products`;
//         const res = await api.get(url);
//         const productsArray = res.data.data ?? [];
//         const mappedProducts: Product[] = productsArray.map((p: any) => ({
//           id: p._id,
//           slug: p.slug,
//           name: p.name,
//           price: p.offerPrice,
//           originalPrice: p.originalPrice,
//           category: p.category?.name,
//           image: p.mainImage?.secure_url,
//           unit: p.unit,
//           description: p.description,
//           organic: true,
//           rating: 4.5,
//         }));
//         // No slice — show ALL products
//         setProducts(mappedProducts);
//         setMobileSlide(0);
//         setDesktopSlide(0);
//       } catch (err: any) {
//         setError(err.response?.data?.message || "Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, [selectedCategory]);

//   if (loading) {
//     return (
//       <section id="products" className="py-6 md:py-14">
//         <div className="container mx-auto px-3 md:px-6">
//           <div className="bg-gray-100 rounded-xl p-3 md:p-5 mb-5 md:mb-8 animate-pulse">
//             <div className="flex items-center justify-between gap-3">
//               <div className="h-5 w-36 md:h-6 md:w-48 bg-gray-300 rounded" />
//               <div className="h-7 w-20 bg-gray-300 rounded-full" />
//             </div>
//             <div className="flex gap-2 mt-3 flex-nowrap overflow-hidden">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <div key={i} className="h-7 w-20 flex-shrink-0 bg-gray-300 rounded-full" />
//               ))}
//             </div>
//           </div>
//           <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-4">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <ProductCardSkeleton key={i} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section id="products" className="py-8 text-center text-destructive text-sm px-4">
//         {error}
//       </section>
//     );
//   }

//   return (
//     <section id="products" className="py-6 md:py-14">
//       <div className="container mx-auto px-3 md:px-6">

//         {/* Header Card */}
//         <div className="bg-gray-100 rounded-xl pl-1 pr-3 py-3 md:pl-2 md:pr-5 md:py-5 mb-5 md:mb-8">
//           <div className="flex items-center justify-between gap-2">
//             <div className="flex items-center gap-2 min-w-0">
//               <div className="w-1 h-7 md:h-10 bg-primary rounded-full flex-shrink-0" />
//               <h2 className="text-base md:text-2xl font-semibold text-gray-800 truncate leading-tight">
//                 {selectedCategory ? selectedCategory.name : "Today's Market Rates"}
//               </h2>
//             </div>
//             <button
//               onClick={() =>
//                 navigate(
//                   selectedCategory
//                     ? `/products?category=${selectedCategory._id}`
//                     : "/products"
//                 )
//               }
//               className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/30 bg-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm"
//             >
//               <span className="text-xs md:text-sm font-medium text-primary group-hover:text-white transition-colors duration-200 whitespace-nowrap">
//                 View All
//               </span>
//               <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                 </svg>
//               </span>
//             </button>
//           </div>

//           <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 overflow-x-auto md:flex-wrap pb-0.5 md:pb-0 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
//             <button
//               onClick={() => setSelectedCategory(null)}
//               className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
//                 !selectedCategory ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
//               }`}
//             >
//               All Items
//             </button>
//             {categories.map((cat) => (
//               <button
//                 key={cat._id}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
//                   selectedCategory?._id === cat._id ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
//                 }`}
//               >
//                 {cat.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Products */}
//         {products.length === 0 ? (
//           <p className="text-center text-muted-foreground text-sm py-10">
//             No products found in this category.
//           </p>
//         ) : (
//           <>
//             {/* ── MOBILE: 2-visible smooth carousel ── */}
//             <div className="block lg:hidden">
//               <div
//                 className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
//                 onTouchStart={onMobileTouchStart}
//                 onTouchMove={onMobileTouchMove}
//                 onTouchEnd={onMobileTouchEnd}
//               >
//                 <div className="flex gap-2.5" style={makeStyle(mobileSlide, mobileDragging, mobileDragOffset, MOBILE_VISIBLE, 10)}>
//                   {products.map((product) => (
//                     <div
//                       key={product.id}
//                       className="flex-shrink-0 w-[calc(50%-5px)]"
//                       onClickCapture={(e) => { if (Math.abs(mobileDragOffset) > 5) e.stopPropagation(); }}
//                     >
//                       <ProductCard product={product} />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {mobileTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-1.5 mt-4">
//                   {Array.from({ length: mobileTotalPages }).map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => { goMobile(i); stopTimer(mobileTimerRef); setTimeout(startMobileTimer, AUTO_SLIDE_INTERVAL); }}
//                       aria-label={`Go to slide ${i + 1}`}
//                       className={`rounded-full transition-all duration-300 ease-out ${
//                         i === mobileSlide ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ── DESKTOP: 5-visible auto-sliding carousel with drag ── */}
//             <div className="hidden lg:block">
//               <div
//                 className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
//                 onMouseDown={onDesktopMouseDown}
//                 onMouseMove={onDesktopMouseMove}
//                 onMouseUp={onDesktopMouseUp}
//                 onMouseLeave={onDesktopMouseUp}
//               >
//                 <div
//                   className="flex gap-4"
//                   style={makeStyle(desktopSlide, desktopDragging, desktopDragOffset, DESKTOP_VISIBLE, 16)}
//                 >
//                   {products.map((product) => (
//                     <div
//                       key={product.id}
//                       className="flex-shrink-0 w-[calc(20%-13px)]"
//                       onClickCapture={(e) => { if (Math.abs(desktopDragOffset) > 5) e.stopPropagation(); }}
//                     >
//                       <ProductCard product={product} />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {desktopTotalPages > 1 && (
//                 <div className="flex justify-center items-center gap-1.5 mt-5">
//                   {Array.from({ length: desktopTotalPages }).map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => { goDesktop(i); stopTimer(desktopTimerRef); setTimeout(startDesktopTimer, AUTO_SLIDE_INTERVAL); }}
//                       aria-label={`Go to slide ${i + 1}`}
//                       className={`rounded-full transition-all duration-300 ease-out ${
//                         i === desktopSlide ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
//                       }`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;

import { useEffect, useState, useRef, useCallback } from "react";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import api from "@/services/api";
import type { Product } from "@/data/products";
import { useNavigate } from "react-router-dom";

type Category = { _id: string; name: string };

const MOBILE_VISIBLE = 2;
const DESKTOP_VISIBLE = 5;
const DRAG_THRESHOLD = 40;

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mobileSlide, setMobileSlide] = useState(0);
  const [desktopSlide, setDesktopSlide] = useState(0);

  const [mobileDragging, setMobileDragging] = useState(false);
  const [desktopDragging, setDesktopDragging] = useState(false);
  const [mobileDragOffset, setMobileDragOffset] = useState(0);
  const [desktopDragOffset, setDesktopDragOffset] = useState(0);

  const mobileDragStartX = useRef(0);
  const desktopDragStartX = useRef(0);
  const mobileDragStartSlide = useRef(0);
  const desktopDragStartSlide = useRef(0);

  const mobileTotalPages = Math.max(0, products.length - MOBILE_VISIBLE + 1);
  const desktopTotalPages = Math.max(0, products.length - DESKTOP_VISIBLE + 1);

  // ── Slide clamp helpers ──
  const goMobile = useCallback(
    (i: number) => setMobileSlide(Math.max(0, Math.min(i, mobileTotalPages - 1))),
    [mobileTotalPages]
  );
  const goDesktop = useCallback(
    (i: number) => setDesktopSlide(Math.max(0, Math.min(i, desktopTotalPages - 1))),
    [desktopTotalPages]
  );

  // ── Drag Handlers ──
  const onMobileTouchStart = (e: React.TouchEvent) => {
    setMobileDragging(true);
    mobileDragStartX.current = e.touches[0].clientX;
    mobileDragStartSlide.current = mobileSlide;
  };
  const onMobileTouchMove = (e: React.TouchEvent) => {
    if (!mobileDragging) return;
    setMobileDragOffset(e.touches[0].clientX - mobileDragStartX.current);
  };
  const onMobileTouchEnd = () => {
    if (!mobileDragging) return;
    setMobileDragging(false);

    // Determine if we should move to next/prev slide
    if (mobileDragOffset < -DRAG_THRESHOLD && mobileSlide < mobileTotalPages - 1) {
      setMobileSlide(prev => prev + 1);
    } else if (mobileDragOffset > DRAG_THRESHOLD && mobileSlide > 0) {
      setMobileSlide(prev => prev - 1);
    }

    // Clear offset
    setMobileDragOffset(0);
  };

  const onDesktopMouseDown = (e: React.MouseEvent) => {
    setDesktopDragging(true);
    desktopDragStartX.current = e.clientX;
    desktopDragStartSlide.current = desktopSlide;
  };
  const onDesktopMouseMove = (e: React.MouseEvent) => {
    if (!desktopDragging) return;
    setDesktopDragOffset(e.clientX - desktopDragStartX.current);
  };
  const onDesktopMouseUp = () => {
    if (!desktopDragging) return;
    setDesktopDragging(false);
    if (desktopDragOffset < -DRAG_THRESHOLD) goDesktop(desktopDragStartSlide.current + 1);
    else if (desktopDragOffset > DRAG_THRESHOLD) goDesktop(desktopDragStartSlide.current - 1);
    setDesktopDragOffset(0);
  };

  const makeStyle = (slide: number, dragging: boolean, dragOffset: number, visibleCards: number, gapPx: number) => {
    const cardPct = 100 / visibleCards;
    // Calculate the base transform based on the current slide index
    const baseTranslate = `calc(-${slide} * (${cardPct}% + ${gapPx}px))`;

    return {
      // translate3d(x, y, z) triggers GPU acceleration
      transform: `translate3d(calc(${baseTranslate} + ${dragOffset}px), 0, 0)`,
      // Ensure transition is snappy when not dragging, and instant when dragging
      transition: dragging ? "none" : "transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)",
      willChange: "transform",
      cursor: dragging ? "grabbing" : "grab",
      touchAction: "pan-y", // Allows vertical scrolling while preventing horizontal browser interference
    };
  };

  // ── Data fetching ──
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.data ?? []);
      } catch (err) { console.error("Failed to load categories"); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const url = selectedCategory ? `/products?category=${selectedCategory._id}` : `/products`;
        const res = await api.get(url);
        const mappedProducts: Product[] = (res.data.data ?? []).map((p: any) => ({
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
        }));
        setProducts(mappedProducts);
        setMobileSlide(0);
        setDesktopSlide(0);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally { setLoading(false); }
    };
    fetchProducts();
  }, [selectedCategory]);

  // Arrow Component for re-use
  const NavButton = ({ direction, onClick, disabled }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border transition-all ${disabled ? "opacity-0 pointer-events-none" : "hover:bg-primary hover:text-white text-gray-700"
        } ${direction === 'left' ? "-left-4" : "-right-4"}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );

  if (loading) return (
    <section className="py-6 md:py-14">
      <div className="container mx-auto px-3 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );

  if (error) return <section className="py-8 text-center text-destructive text-sm px-4">{error}</section>;

  return (
    <section id="products" className="py-6 md:py-14">
      <div className="container mx-auto px-3 md:px-6">
        {/* Header Card */}
        <div className="bg-gray-100 rounded-xl pl-1 pr-3 py-3 md:pl-2 md:pr-5 md:py-5 mb-5 md:mb-8">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-1 h-7 md:h-10 bg-primary rounded-full flex-shrink-0" />
              <h2 className="text-base md:text-2xl font-semibold text-gray-800 truncate leading-tight">
                {selectedCategory ? selectedCategory.name : "Today's Market Rates"}
              </h2>
            </div>
            <button
              onClick={() =>
                navigate(
                  selectedCategory
                    ? `/products?category=${selectedCategory._id}`
                    : "/products"
                )
              }
              className="group flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-primary/30 bg-white hover:bg-primary hover:border-primary transition-all duration-200 shadow-sm"
            >
              <span className="text-xs md:text-sm font-medium text-primary group-hover:text-white transition-colors duration-200 whitespace-nowrap">
                View All
              </span>
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-200 group-hover:translate-x-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          <div className="flex gap-1.5 md:gap-2 mt-3 md:mt-4 overflow-x-auto md:flex-wrap pb-0.5 md:pb-0 scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${!selectedCategory ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
                }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${selectedCategory?._id === cat._id ? "bg-primary text-white" : "bg-white text-gray-600 border hover:bg-gray-50"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel Container */}
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-10">No products found.</p>
        ) : (
          <>
            {/* MOBILE VIEW */}
            <div className="block lg:hidden relative">
              <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4">
                {products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[calc(80%-10px)] snap-center">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <NavButton direction="left" onClick={() => goMobile(mobileSlide - 1)} disabled={mobileSlide === 0} />
              <NavButton direction="right" onClick={() => goMobile(mobileSlide + 1)} disabled={mobileSlide >= mobileTotalPages - 1} />
            </div>

            {/* DESKTOP VIEW */}
            <div className="hidden lg:block relative">
              <div className="overflow-hidden" onMouseDown={onDesktopMouseDown} onMouseMove={onDesktopMouseMove} onMouseUp={onDesktopMouseUp} onMouseLeave={onDesktopMouseUp}>
                <div className="flex gap-4" style={makeStyle(desktopSlide, desktopDragging, desktopDragOffset, DESKTOP_VISIBLE, 16)}>
                  {products.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-[calc(20%-13px)]">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              <NavButton direction="left" onClick={() => goDesktop(desktopSlide - 1)} disabled={desktopSlide === 0} />
              <NavButton direction="right" onClick={() => goDesktop(desktopSlide + 1)} disabled={desktopSlide >= desktopTotalPages - 1} />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;