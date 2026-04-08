// import {
//   ShoppingCart, LogOut, Search, Leaf,
//   User as UserIcon, Package, MapPin, ChevronDown
// } from "lucide-react";
// import {
//   DropdownMenu, DropdownMenuContent,
//   DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useCartStore } from "@/store/cartStore";
// import { useAuthStore } from "@/store/authStore";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import api from "@/services/api";

// const NAV_LINKS = [
//   { label: "About Us", id: "about" },
//   { label: "Why Choose Us", id: "why" },
//   { label: "Contact Us", id: "contact" },
// ];

// const scrollTo = (id: string) => {
//   const el = document.getElementById(id);
//   if (el) {
//     const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
//     window.scrollTo({ top: y, behavior: "smooth" });
//   }
// };

// const Header = () => {
//   const { totalItems, fetchCart, setCartOpen } = useCartStore();
//   const { user, logout, isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();

//   const [locations, setLocations] = useState<any[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
//   const [searchQuery, setSearchQuery] = useState("");
//   useEffect(() => {
//     if (isAuthenticated) fetchCart();
//   }, [isAuthenticated, fetchCart]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const res = await api.get('/areas/public');
//         // Handle both possible structures: raw array or nested inside data
//         const data = res.data?.data || res.data;
//         if (Array.isArray(data)) {
//           setLocations(data);
//           if (data.length > 0) {
//             const defaultName = data[0].name || data[0].areaName || data[0].area_name || "Location";
//             setSelectedLocation(defaultName);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch locations:", error);
//       }
//     };
//     fetchLocations();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const navItemVariants = {
//     hidden: { opacity: 0, y: -8 },
//     visible: (i: number) => ({
//       opacity: 1, y: 0,
//       transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
//     }),
//   };


//   const handleSearch = async () => {
//   if (!searchQuery.trim()) {
//     toast.error("Please enter something to search");
//     return;
//   }

//   try {
//     // ✅ Call API to find product
//     const res = await api.get(`/products?search=${searchQuery}`);

//     const products = res.data?.data || [];

//     if (products.length === 0) {
//       toast.error("Product not found");
//       return;
//     }

//     // ✅ Take first matched product
//     const product = products[0];

//     // 👉 Redirect to product detail page
//     navigate(`/product/${product.slug}`);

//   } catch (error) {
//     console.error(error);
//     toast.error("Search failed");
//   }
// };
//   return (
//     <>
//       {/* ── 1. TOP GREEN STRIP ───────────────────────────── */}
//       <motion.div
//         initial={{ y: -30, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className="w-full bg-green-600 text-white text-xs md:text-sm py-1.5"
//       >
//         <div className="container mx-auto px-4 md:px-6 flex items-center justify-center gap-2 font-medium tracking-wide">
//           <span className="animate-pulse">⚡</span>
//           <span className="whitespace-nowrap">Daily Market Rates Updated</span>
//           <span className="opacity-70 hidden sm:inline">|</span>
//           <span className="whitespace-nowrap">Order before <span className="font-semibold">10 PM</span></span>
//           <span className="opacity-70 hidden sm:inline">|</span>
//           <span className="whitespace-nowrap hidden md:inline">Guaranteed next-day morning delivery</span>
//         </div>
//       </motion.div>



//       {/* ── 3. MAIN HEADER ───────────────────────────────── */}
//       <motion.header
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
//         className="sticky top-0 z-50 bg-white border-b shadow-sm"
//       >
//         <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">

//           {/* LOGO */}
//           <motion.div
//             whileHover={{ scale: 1.04 }}
//             whileTap={{ scale: 0.97 }}
//             transition={{ type: "spring", stiffness: 300 }}
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => navigate("/")}
//           >
//             <motion.div
//               animate={{ rotate: [0, -10, 10, -5, 0] }}
//               transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
//             >
//               <Leaf className="w-7 h-7 text-green-600" />
//             </motion.div>
//             <span className="text-xl font-bold text-gray-800">
//               Fresh<span className="text-green-600">Bulk</span>
//             </span>
//           </motion.div>

//           {/* SEARCH */}
//           <div className="flex-1 mx-6 hidden md:flex items-center gap-4">
//             {/* Location Selector */}
//             <DropdownMenu>
//               <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 transition-colors focus:outline-none">
//                 <MapPin className="w-4 h-4 text-green-600" />
//                 <span className="max-w-[120px] truncate font-medium">{selectedLocation}</span>
//                 <ChevronDown className="w-3 h-3 text-slate-400" />
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
//                 <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Available Areas</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 {locations.length > 0 ? (
//                   locations.map((loc, idx) => {
//                     const locName = loc.name || loc.areaName || loc.area_name || `Location ${idx + 1}`;
//                     return (
//                       <DropdownMenuItem
//                         key={idx}
//                         onClick={() => setSelectedLocation(locName)}
//                         className="cursor-pointer"
//                       >
//                         {locName}
//                       </DropdownMenuItem>
//                     );
//                   })
//                 ) : (
//                   <DropdownMenuItem disabled className="text-sm italic text-slate-400">No locations found</DropdownMenuItem>
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Search Bar */}
//             <motion.div
//               initial={{ scaleX: 0.85, opacity: 0 }}
//               animate={{ scaleX: 1, opacity: 1 }}
//               transition={{ duration: 0.4, delay: 0.3 }}
//               className="relative w-full max-w-xl mx-auto"
//             >
//               <Search
//                 onClick={handleSearch}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
//               />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSearch();
//                 }}
//                 placeholder="Search for bulk onions, tomatoes, exotic fruits..."
//                 className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm
//     focus:outline-none focus:ring-2 focus:ring-green-500
//     transition-all duration-200 hover:shadow-sm"
//               />
//             </motion.div>
//           </div>

//           {/* RIGHT NAV */}
//           <div className="flex items-center gap-4 text-xs md:text-sm">

//             {/* Auth */}
//             <motion.div
//               custom={0}
//               variants={navItemVariants}
//               initial="hidden"
//               animate="visible"
//             >
//               {isAuthenticated && user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       className="flex flex-col items-center cursor-pointer
//                         text-gray-700 hover:text-green-600 transition-colors"
//                     >
//                       <UserIcon className="w-5 h-5" />
//                       <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
//                     </motion.button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48 mt-2">
//                     <DropdownMenuLabel>
//                       <p className="font-semibold">{user.name}</p>
//                       <p className="text-xs text-gray-500">{user.email}</p>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate("/profile")}>
//                       <UserIcon className="w-4 h-4 mr-2" /> Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => navigate("/orders")}>
//                       <Package className="w-4 h-4 mr-2" /> Orders
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                       <LogOut className="w-4 h-4 mr-2" /> Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <motion.button
//                   whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}
//                   whileTap={{ scale: 0.96 }}
//                   onClick={() => navigate("/login")}
//                   className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm
//                     hover:bg-green-700 transition-colors duration-200"
//                 >
//                   Login
//                 </motion.button>
//               )}
//             </motion.div>

//             {/* Orders */}
//             <motion.div
//               custom={1}
//               variants={navItemVariants}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ scale: 1.08, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/orders")}
//               className="flex flex-col items-center cursor-pointer
//                 text-gray-700 hover:text-green-600 transition-colors duration-200"
//             >
//               <Package className="w-5 h-5" />
//               <span className="hidden sm:block">Repeat Orders</span>
//             </motion.div>

//             {/* Cart */}
//             <motion.div
//               custom={2}
//               variants={navItemVariants}
//               initial="hidden"
//               animate="visible"
//               whileHover={{ scale: 1.08, y: -2 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setCartOpen(true)}
//               className="relative flex flex-col items-center cursor-pointer
//                 text-gray-700 hover:text-green-600 transition-colors duration-200"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               <span className="hidden sm:block">My Cart</span>

//               <AnimatePresence>
//                 {totalItems > 0 && (
//                   <motion.span
//                     key="badge"
//                     initial={{ scale: 0 }}
//                     animate={{ scale: 1 }}
//                     exit={{ scale: 0 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                     className="absolute -top-2 -right-2 bg-green-600 text-white
//                       text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
//                   >
//                     {totalItems}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </motion.div>

//           </div>
//         </div>
//       </motion.header>
//     </>
//   );
// };

// export default Header;

import {
  ShoppingCart, LogOut, Search, Leaf,
  User as UserIcon, Package, MapPin, ChevronDown, X
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "@/services/api";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

const Header = () => {
  const { totalItems, fetchCart, setCartOpen } = useCartStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/areas/public');
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
          setLocations(data);
          if (data.length > 0) {
            const defaultName = data[0].name || data[0].areaName || data[0].area_name || "Location";
            setSelectedLocation(defaultName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };
    fetchLocations();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced suggestion fetcher
 const fetchSuggestions = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    
    // Only search if we have at least 2 characters
    if (!trimmedQuery || trimmedQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    try {
      // Ensure the endpoint and param name matches your backend
      const res = await api.get(`/products`, { 
        params: { search: trimmedQuery } 
      });

      const raw = res.data;
      
      // Improved data extraction logic
      let products: any[] = [];
      if (Array.isArray(raw)) {
        products = raw;
      } else if (raw?.data && Array.isArray(raw.data)) {
        products = raw.data;
      } else if (raw?.products && Array.isArray(raw.products)) {
        products = raw.products;
      } else if (raw?.data?.products && Array.isArray(raw.data.products)) {
        products = raw.data.products;
      }

      setSuggestions(products.slice(0, 8));
      // Only show if we actually got results
      setShowSuggestions(products.length > 0);
      
    } catch (error) {
      console.error("Suggestion fetch error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoadingSuggestions(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300); // 300ms debounce
  };

  const handleSelectSuggestion = (product: any) => {
    const identifier = product.slug || product._id || product.id;
    setSearchQuery(product.name || product.title || "");
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIndex(-1);
    if (identifier) navigate(`/product/${identifier}`);
  };

  const handleSearch = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      toast.error("Please enter something to search");
      return;
    }
    setShowSuggestions(false);

    try {
      const res = await api.get(`/products`, { params: { search: trimmed } });

      const raw = res.data;
      const products =
        raw?.data?.products ||
        raw?.data ||
        raw?.products ||
        raw?.results ||
        raw || [];
      if (products.length === 0) {
        toast.error("No products found");
        return;
      }

      if (products.length === 1) {
        const identifier = products[0].slug || products[0]._id || products[0].id;
        navigate(`/product/${identifier}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    } catch {
      toast.error("Search failed. Please try again.");
    }
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
    }),
  };

  return (
    <>
      {/* ── TOP GREEN STRIP ───────────────────────────── */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-green-600 text-white text-xs md:text-sm py-1.5"
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center gap-2 font-medium tracking-wide">
          <span className="animate-pulse">⚡</span>
          <span className="whitespace-nowrap">Daily Market Rates Updated</span>
          <span className="opacity-70 hidden sm:inline">|</span>
          <span className="whitespace-nowrap">Order before <span className="font-semibold">10 PM</span></span>
          <span className="opacity-70 hidden sm:inline">|</span>
          <span className="whitespace-nowrap hidden md:inline">Guaranteed next-day morning delivery</span>
        </div>
      </motion.div>

      {/* ── MAIN HEADER ───────────────────────────────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white border-b shadow-sm"
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">

          {/* LOGO */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 0] }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
            >
              <Leaf className="w-7 h-7 text-green-600" />
            </motion.div>
            <span className="text-xl font-bold text-gray-800">
              Fresh<span className="text-green-600">Bulk</span>
            </span>
          </motion.div>

          {/* SEARCH */}
          <div className="flex-1 mx-6 hidden md:flex items-center gap-4">
            {/* Location Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 transition-colors focus:outline-none">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="max-w-[120px] truncate font-medium">{selectedLocation}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
                <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Available Areas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {locations.length > 0 ? (
                  locations.map((loc, idx) => {
                    const locName = loc.name || loc.areaName || loc.area_name || `Location ${idx + 1}`;
                    return (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => setSelectedLocation(locName)}
                        className="cursor-pointer"
                      >
                        {locName}
                      </DropdownMenuItem>
                    );
                  })
                ) : (
                  <DropdownMenuItem disabled className="text-sm italic text-slate-400">No locations found</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search Bar with Suggestions */}
            <motion.div
              ref={searchRef}
              initial={{ scaleX: 0.85, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative w-full max-w-xl mx-auto"
            >
              <Search
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer z-10"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                placeholder="Search for bulk onions, tomatoes, exotic fruits..."
                className="w-full pl-10 pr-8 py-2.5 border rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-green-500
                  transition-all duration-200 hover:shadow-sm"
              />

              {/* Clear button */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
                  >
                    {loadingSuggestions ? (
                      <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                        <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                        Searching...
                      </div>
                    ) : (
                      <ul>
                        {suggestions.map((product, idx) => {
                          const name = product.name || product.title || "Unknown Product";
                          const category = product.category?.name || product.categoryName || "";
                          const price = product.price ?? product.basePrice ?? null;
                          const image = product.image || product.imageUrl || product.thumbnail || null;

                          return (
                            <li
                              key={product._id || product.id || idx}
                              onMouseDown={() => handleSelectSuggestion(product)}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
                                ${activeIndex === idx ? "bg-green-50" : "hover:bg-gray-50"}`}
                            >
                              {/* Product image or fallback icon */}
                              <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                {image ? (
                                  <img src={image} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                  <Leaf className="w-4 h-4 text-green-400" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{name}</p>
                                {category && (
                                  <p className="text-xs text-gray-400 truncate">{category}</p>
                                )}
                              </div>

                              {price !== null && (
                                <span className="text-xs font-semibold text-green-600 whitespace-nowrap">
                                  ₹{price}
                                </span>
                              )}
                            </li>
                          );
                        })}

                        {/* "See all results" footer */}
                        <li
                          onMouseDown={handleSearch}
                          className="px-4 py-2 text-xs text-center text-green-600 font-medium
                            hover:bg-green-50 cursor-pointer border-t border-gray-100"
                        >
                          See all results for "{searchQuery}"
                        </li>
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* RIGHT NAV */}
          <div className="flex items-center gap-4 text-xs md:text-sm">

            {/* Auth */}
            <motion.div custom={0} variants={navItemVariants} initial="hidden" animate="visible">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 mt-2">
                    <DropdownMenuLabel>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserIcon className="w-4 h-4 mr-2" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/orders")}>
                      <Package className="w-4 h-4 mr-2" /> Orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors duration-200"
                >
                  Login
                </motion.button>
              )}
            </motion.div>

            {/* Orders */}
            <motion.div
              custom={1} variants={navItemVariants} initial="hidden" animate="visible"
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <Package className="w-5 h-5" />
              <span className="hidden sm:block">Repeat Orders</span>
            </motion.div>

            {/* Cart */}
            <motion.div
              custom={2} variants={navItemVariants} initial="hidden" animate="visible"
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block">My Cart</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;