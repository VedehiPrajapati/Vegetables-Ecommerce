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
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── CACHE REFS FOR INSTANT SUGGESTIONS ──────────────────────────────────
  const productCacheRef = useRef<any[]>([]);
  const cacheLoadedRef = useRef(false);
  const cacheLoadingRef = useRef(false);

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

  // ── PRELOAD ALL PRODUCTS INTO CACHE ONCE ON MOUNT ────────────────────────
  const preloadCache = useCallback(async () => {
    if (cacheLoadedRef.current || cacheLoadingRef.current) return;
    cacheLoadingRef.current = true;
    try {
      const res = await api.get(`/products`, { params: { limit: 500 } });
      const raw = res.data;
      let products: any[] = [];
      if (Array.isArray(raw)) {
        products = raw;
      } else if (raw?.data?.products && Array.isArray(raw.data.products)) {
        products = raw.data.products;
      } else if (raw?.data && Array.isArray(raw.data)) {
        products = raw.data;
      } else if (raw?.products && Array.isArray(raw.products)) {
        products = raw.products;
      }
      productCacheRef.current = products;
      cacheLoadedRef.current = true;
    } catch (e) {
      console.error("Cache preload failed:", e);
    } finally {
      cacheLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    preloadCache();
  }, [preloadCache]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── FETCH SUGGESTIONS: instant from cache, fallback to API ───────────────
  const fetchSuggestions = useCallback(async (query: string) => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Cache is ready → instant client-side filter, zero network calls
    if (cacheLoadedRef.current) {
      const filtered = productCacheRef.current
        .filter(p => {
          const name = (p.name || p.title || "").toLowerCase();
          const category = (p.category?.name || p.categoryName || "").toLowerCase();
          return name.includes(trimmedQuery) || category.includes(trimmedQuery);
        })
        .slice(0, 10);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      return;
    }

    // Cache not ready yet → fall back to API
    setLoadingSuggestions(true);
    try {
      const res = await api.get(`/products`, {
        params: { search: trimmedQuery }
      });

      const raw = res.data;
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

      setSuggestions(products.slice(0, 10));
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

    // If cache is loaded, filter instantly with no debounce needed
    if (cacheLoadedRef.current) {
      fetchSuggestions(val);
    } else {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(val);
      }, 150);
    }
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
        raw?.data?.products || raw?.data || raw?.products || raw?.results || raw || [];
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

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
    }),
  };

  // Shared suggestions dropdown content
  const SuggestionsDropdown = () => (
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
              <li
                onMouseDown={handleSearch}
                className="px-4 py-2 text-xs text-center text-green-600 font-medium hover:bg-green-50 cursor-pointer border-t border-gray-100"
              >
                See all results for "{searchQuery}"
              </li>
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

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
        <div className="container mx-auto px-4 md:px-6">
          {/* ── DESKTOP ROW (md+) ───────────────────────── */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* LOGO */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
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

              {/* Search Bar — Desktop */}
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
                    else if (searchQuery.trim().length >= 1) fetchSuggestions(searchQuery);
                  }}
                  placeholder="Search for bulk onions, tomatoes, exotic fruits..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-all duration-200 hover:shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Desktop suggestions dropdown */}
                <SuggestionsDropdown />
              </motion.div>
            </div>

            {/* RIGHT NAV */}
            <div className="flex items-center gap-4 text-sm flex-shrink-0">
              <motion.div custom={0} variants={navItemVariants} initial="hidden" animate="visible">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors"
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>{user.name.split(" ")[0]}</span>
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

              <motion.div
                custom={1} variants={navItemVariants} initial="hidden" animate="visible"
                whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/orders")}
                className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                <Package className="w-5 h-5" />
                <span>Repeat Orders</span>
              </motion.div>

              <motion.div
                custom={2} variants={navItemVariants} initial="hidden" animate="visible"
                whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="relative flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>My Cart</span>
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

          {/* ── MOBILE ROW (< md) ───────────────────────── */}
          <div className="flex md:hidden items-center justify-between h-14">
            {/* LOGO */}
            <motion.div
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-lg font-bold text-gray-800">
                Fresh<span className="text-green-600">Bulk</span>
              </span>
            </motion.div>

            {/* RIGHT: cart + user */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key="badge-mobile"
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="absolute top-0.5 right-0.5 bg-green-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User */}
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold text-sm flex items-center justify-center"
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 mt-2">
                    <DropdownMenuLabel>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE LOCATION + SEARCH STRIP (always visible, < md) ── */}
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-3 pt-2 flex items-center gap-2">

          {/* Location row — always visible */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 flex-shrink-0 px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm text-green-800 transition-colors focus:outline-none">
              <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="flex-1 text-left truncate font-medium text-green-800">{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-h-56 overflow-y-auto">
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
                      <MapPin className="w-3.5 h-3.5 mr-2 text-green-500" />
                      {locName}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <DropdownMenuItem disabled className="text-sm italic text-slate-400">No locations found</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search bar — always visible */}
          <div ref={mobileSearchRef} className="relative flex-1">
            <Search
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer z-10"
            />
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
                else if (searchQuery.trim().length >= 1) fetchSuggestions(searchQuery);
              }}
              placeholder="Search veggies, fruits, grains..."
              className="w-full pl-10 pr-8 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all bg-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto"
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
                            onTouchEnd={() => handleSelectSuggestion(product)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors
                              ${activeIndex === idx ? "bg-green-50" : "hover:bg-gray-50"}`}
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
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
                      <li
                        onMouseDown={handleSearch}
                        onTouchEnd={handleSearch}
                        className="px-4 py-2.5 text-xs text-center text-green-600 font-medium hover:bg-green-50 cursor-pointer border-t border-gray-100"
                      >
                        See all results for "{searchQuery}"
                      </li>
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
// import {
//   ShoppingCart, LogOut, Search, Leaf,
//   User as UserIcon, Package, MapPin, ChevronDown, X
// } from "lucide-react";
// import {
//   DropdownMenu, DropdownMenuContent,
//   DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useCartStore } from "@/store/cartStore";
// import { useAuthStore } from "@/store/authStore";
// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import api from "@/services/api";

// const Header = () => {
//   const { totalItems, fetchCart, setCartOpen } = useCartStore();
//   const { user, logout, isAuthenticated } = useAuthStore();
//   const navigate = useNavigate();

//   const [locations, setLocations] = useState<any[]>([]);
//   const [selectedLocation, setSelectedLocation] = useState<string>("Select Location");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [loadingSuggestions, setLoadingSuggestions] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(-1);

//   const searchRef = useRef<HTMLDivElement>(null);
//   const mobileSearchRef = useRef<HTMLDivElement>(null);
//   const mobileInputRef = useRef<HTMLInputElement>(null);
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const productCacheRef = useRef<any[]>([]);
// const cacheLoadedRef = useRef(false);
// const cacheLoadingRef = useRef(false);
//   useEffect(() => {
//     if (isAuthenticated) fetchCart();
//   }, [isAuthenticated, fetchCart]);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const res = await api.get('/areas/public');
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

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         searchRef.current && !searchRef.current.contains(e.target as Node) &&
//         mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
//       ) {
//         setShowSuggestions(false);
//         setActiveIndex(-1);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//  // Pre-load all products into cache once (silent background fetch)
// const preloadCache = useCallback(async () => {
//   if (cacheLoadedRef.current || cacheLoadingRef.current) return;
//   cacheLoadingRef.current = true;
//   try {
//     const res = await api.get(`/products`, { params: { limit: 500 } });
//     const raw = res.data;
//     let products: any[] = [];
//     if (Array.isArray(raw)) products = raw;
//     else if (raw?.data?.products && Array.isArray(raw.data.products)) products = raw.data.products;
//     else if (raw?.data && Array.isArray(raw.data)) products = raw.data;
//     else if (raw?.products && Array.isArray(raw.products)) products = raw.products;
//     productCacheRef.current = products;
//     cacheLoadedRef.current = true;
//   } catch (e) {
//     console.error("Cache preload failed:", e);
//   } finally {
//     cacheLoadingRef.current = false;
//   }
// }, []);

// const fetchSuggestions = useCallback(async (query: string) => {
//   const trimmedQuery = query.trim().toLowerCase();
//   if (!trimmedQuery) {
//     setSuggestions([]);
//     setShowSuggestions(false);
//     return;
//   }

//   // If cache is ready → instant client-side filter, zero network calls
//   if (cacheLoadedRef.current) {
//     const filtered = productCacheRef.current
//       .filter(p => {
//         const name = (p.name || p.title || "").toLowerCase();
//         const category = (p.category?.name || p.categoryName || "").toLowerCase();
//         return name.includes(trimmedQuery) || category.includes(trimmedQuery);
//       })
//       .slice(0, 10);
//     setSuggestions(filtered);
//     setShowSuggestions(filtered.length > 0);
//     return;
//   }

//   // Cache not ready yet → fall back to API once, then populate cache
//   setLoadingSuggestions(true);
//   try {
//     const res = await api.get(`/products`, { params: { search: trimmedQuery } });
//     const raw = res.data;
//     let products: any[] = [];
//     if (Array.isArray(raw)) products = raw;
//     else if (raw?.data?.products && Array.isArray(raw.data.products)) products = raw.data.products;
//     else if (raw?.data && Array.isArray(raw.data)) products = raw.data;
//     else if (raw?.products && Array.isArray(raw.products)) products = raw.products;
//     setSuggestions(products.slice(0, 10));
//     setShowSuggestions(products.length > 0);
//   } catch (error) {
//     console.error("Suggestion fetch error:", error);
//     setSuggestions([]);
//     setShowSuggestions(false);
//   } finally {
//     setLoadingSuggestions(false);
//   }
// }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setSearchQuery(val);
//     setActiveIndex(-1);

//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       fetchSuggestions(val);
//     }, 150);
//   };

//   const handleSelectSuggestion = (product: any) => {
//     const identifier = product.slug || product._id || product.id;
//     setSearchQuery(product.name || product.title || "");
//     setShowSuggestions(false);
//     setSuggestions([]);
//     setActiveIndex(-1);
//     if (identifier) navigate(`/product/${identifier}`);
//   };

//   const handleSearch = async () => {
//     const trimmed = searchQuery.trim();
//     if (!trimmed) {
//       toast.error("Please enter something to search");
//       return;
//     }
//     setShowSuggestions(false);

//     try {
//       const res = await api.get(`/products`, { params: { search: trimmed } });
//       const raw = res.data;
//       const products =
//         raw?.data?.products || raw?.data || raw?.products || raw?.results || raw || [];
//       if (products.length === 0) {
//         toast.error("No products found");
//         return;
//       }
//       if (products.length === 1) {
//         const identifier = products[0].slug || products[0]._id || products[0].id;
//         navigate(`/product/${identifier}`);
//       } else {
//         navigate(`/search?q=${encodeURIComponent(trimmed)}`);
//       }
//     } catch {
//       toast.error("Search failed. Please try again.");
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (!showSuggestions) {
//       if (e.key === "Enter") handleSearch();
//       return;
//     }
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setActiveIndex(prev => Math.max(prev - 1, -1));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (activeIndex >= 0 && suggestions[activeIndex]) {
//         handleSelectSuggestion(suggestions[activeIndex]);
//       } else {
//         handleSearch();
//       }
//     } else if (e.key === "Escape") {
//       setShowSuggestions(false);
//       setActiveIndex(-1);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     setSuggestions([]);
//     setShowSuggestions(false);
//   };

//   const navItemVariants = {
//     hidden: { opacity: 0, y: -8 },
//     visible: (i: number) => ({
//       opacity: 1, y: 0,
//       transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
//     }),
//   };

//   // Shared suggestions dropdown content
//   const SuggestionsDropdown = () => (
//     <AnimatePresence>
//       {showSuggestions && (
//         <motion.div
//           initial={{ opacity: 0, y: -6 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -6 }}
//           transition={{ duration: 0.15 }}
//           className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
//         >
//           {loadingSuggestions ? (
//             <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
//               <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
//               Searching...
//             </div>
//           ) : (
//             <ul>
//               {suggestions.map((product, idx) => {
//                 const name = product.name || product.title || "Unknown Product";
//                 const category = product.category?.name || product.categoryName || "";
//                 const price = product.price ?? product.basePrice ?? null;
//                 const image = product.image || product.imageUrl || product.thumbnail || null;

//                 return (
//                   <li
//                     key={product._id || product.id || idx}
//                     onMouseDown={() => handleSelectSuggestion(product)}
//                     onMouseEnter={() => setActiveIndex(idx)}
//                     className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors
//                       ${activeIndex === idx ? "bg-green-50" : "hover:bg-gray-50"}`}
//                   >
//                     <div className="w-9 h-9 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
//                       {image ? (
//                         <img src={image} alt={name} className="w-full h-full object-cover" />
//                       ) : (
//                         <Leaf className="w-4 h-4 text-green-400" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-800 truncate">{name}</p>
//                       {category && (
//                         <p className="text-xs text-gray-400 truncate">{category}</p>
//                       )}
//                     </div>
//                     {price !== null && (
//                       <span className="text-xs font-semibold text-green-600 whitespace-nowrap">
//                         ₹{price}
//                       </span>
//                     )}
//                   </li>
//                 );
//               })}
//               <li
//                 onMouseDown={handleSearch}
//                 className="px-4 py-2 text-xs text-center text-green-600 font-medium hover:bg-green-50 cursor-pointer border-t border-gray-100"
//               >
//                 See all results for "{searchQuery}"
//               </li>
//             </ul>
//           )}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
//  useEffect(() => {
//   preloadCache();
// }, [preloadCache]);
//   return (
//     <>
//       {/* ── TOP GREEN STRIP ───────────────────────────── */}
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

//       {/* ── MAIN HEADER ───────────────────────────────── */}
//       <motion.header
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
//         className="sticky top-0 z-50 bg-white border-b shadow-sm"
//       >
//         <div className="container mx-auto px-4 md:px-6">
//           {/* ── DESKTOP ROW (md+) ───────────────────────── */}
//           <div className="hidden md:flex items-center justify-between h-16">
//             {/* LOGO */}
//             <motion.div
//               whileHover={{ scale: 1.04 }}
//               whileTap={{ scale: 0.97 }}
//               transition={{ type: "spring", stiffness: 300 }}
//               className="flex items-center gap-2 cursor-pointer flex-shrink-0"
//               onClick={() => navigate("/")}
//             >
//               <motion.div
//                 animate={{ rotate: [0, -10, 10, -5, 0] }}
//                 transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
//               >
//                 <Leaf className="w-7 h-7 text-green-600" />
//               </motion.div>
//               <span className="text-xl font-bold text-gray-800">
//                 Fresh<span className="text-green-600">Bulk</span>
//               </span>
//             </motion.div>

//             {/* SEARCH */}
//             <div className="flex-1 mx-6 hidden md:flex items-center gap-4">
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

//             {/* RIGHT NAV */}
//             <div className="flex items-center gap-4 text-sm flex-shrink-0">
//               <motion.div custom={0} variants={navItemVariants} initial="hidden" animate="visible">
//                 {isAuthenticated && user ? (
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors"
//                       >
//                         <UserIcon className="w-5 h-5" />
//                         <span>{user.name.split(" ")[0]}</span>
//                       </motion.button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48 mt-2">
//                       <DropdownMenuLabel>
//                         <p className="font-semibold">{user.name}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </DropdownMenuLabel>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={() => navigate("/profile")}>
//                         <UserIcon className="w-4 h-4 mr-2" /> Profile
//                       </DropdownMenuItem>
//                       <DropdownMenuItem onClick={() => navigate("/orders")}>
//                         <Package className="w-4 h-4 mr-2" /> Orders
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                         <LogOut className="w-4 h-4 mr-2" /> Logout
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 ) : (
//                   <motion.button
//                     whileHover={{ scale: 1.05, boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}
//                     whileTap={{ scale: 0.96 }}
//                     onClick={() => navigate("/login")}
//                     className="px-4 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors duration-200"
//                   >
//                     Login
//                   </motion.button>
//                 )}
//               </motion.div>

//               <motion.div
//                 custom={1} variants={navItemVariants} initial="hidden" animate="visible"
//                 whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
//                 onClick={() => navigate("/orders")}
//                 className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
//               >
//                 <Package className="w-5 h-5" />
//                 <span>Repeat Orders</span>
//               </motion.div>

//               <motion.div
//                 custom={2} variants={navItemVariants} initial="hidden" animate="visible"
//                 whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.95 }}
//                 onClick={() => setCartOpen(true)}
//                 className="relative flex flex-col items-center cursor-pointer text-gray-700 hover:text-green-600 transition-colors duration-200"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 <span>My Cart</span>
//                 <AnimatePresence>
//                   {totalItems > 0 && (
//                     <motion.span
//                       key="badge"
//                       initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                       className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
//                     >
//                       {totalItems}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </div>
//           </div>

//           {/* ── MOBILE ROW (< md) ───────────────────────── */}
//           <div className="flex md:hidden items-center justify-between h-14">
//             {/* LOGO */}
//             <motion.div
//               whileTap={{ scale: 0.97 }}
//               className="flex items-center gap-1.5 cursor-pointer"
//               onClick={() => navigate("/")}
//             >
//               <Leaf className="w-6 h-6 text-green-600" />
//               <span className="text-lg font-bold text-gray-800">
//                 Fresh<span className="text-green-600">Bulk</span>
//               </span>
//             </motion.div>

//             {/* RIGHT: cart + user */}
//             <div className="flex items-center gap-2">
//               {/* Cart */}
//               <motion.button
//                 whileTap={{ scale: 0.92 }}
//                 onClick={() => setCartOpen(true)}
//                 className="relative p-2 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
//               >
//                 <ShoppingCart className="w-5 h-5" />
//                 <AnimatePresence>
//                   {totalItems > 0 && (
//                     <motion.span
//                       key="badge-mobile"
//                       initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 15 }}
//                       className="absolute top-0.5 right-0.5 bg-green-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold"
//                     >
//                       {totalItems}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>
//               </motion.button>

//               {/* User */}
//               {isAuthenticated && user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <motion.button
//                       whileTap={{ scale: 0.92 }}
//                       className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-semibold text-sm flex items-center justify-center"
//                     >
//                       {user.name.charAt(0).toUpperCase()}
//                     </motion.button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48 mt-2">
//                     <DropdownMenuLabel>
//                       <p className="font-semibold">{user.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
//                   whileTap={{ scale: 0.96 }}
//                   onClick={() => navigate("/login")}
//                   className="px-3 py-1.5 bg-green-600 text-white rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
//                 >
//                   Login
//                 </motion.button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── MOBILE LOCATION + SEARCH STRIP (always visible, < md) ── */}
//         <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-3 pt-2 space-y-2">

//           {/* Location row — always visible */}
//           <DropdownMenu>
//             <DropdownMenuTrigger className="flex items-center gap-2 w-full px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-sm text-green-800 transition-colors focus:outline-none">
//               <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
//               <span className="flex-1 text-left truncate font-medium text-green-800">{selectedLocation}</span>
//               <ChevronDown className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="start" className="w-[calc(100vw-2rem)] max-h-56 overflow-y-auto">
//               <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">Available Areas</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               {locations.length > 0 ? (
//                 locations.map((loc, idx) => {
//                   const locName = loc.name || loc.areaName || loc.area_name || `Location ${idx + 1}`;
//                   return (
//                     <DropdownMenuItem
//                       key={idx}
//                       onClick={() => setSelectedLocation(locName)}
//                       className="cursor-pointer"
//                     >
//                       <MapPin className="w-3.5 h-3.5 mr-2 text-green-500" />
//                       {locName}
//                     </DropdownMenuItem>
//                   );
//                 })
//               ) : (
//                 <DropdownMenuItem disabled className="text-sm italic text-slate-400">No locations found</DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Search bar — always visible */}
//           <div ref={mobileSearchRef} className="relative">
//             <Search
//               onClick={handleSearch}
//               className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer z-10"
//             />
//             <input
//   type="text"
//   value={searchQuery}
//   onChange={handleInputChange}
//   onKeyDown={handleKeyDown}
//   onFocus={() => {
//     if (suggestions.length > 0) setShowSuggestions(true);
//     else if (searchQuery.trim().length >= 1) fetchSuggestions(searchQuery);
//   }}
//   placeholder="Search for bulk onions, tomatoes, exotic fruits..."
//   className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm
//     focus:outline-none focus:ring-2 focus:ring-green-500
//     transition-all duration-200 hover:shadow-sm"
// /><SuggestionsDropdown />
//             {searchQuery && (
//               <button
//                 onClick={clearSearch}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-3.5 h-3.5" />
//               </button>
//             )}

//             {/* Mobile suggestions dropdown */}
//             <AnimatePresence>
//               {showSuggestions && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -6 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -6 }}
//                   transition={{ duration: 0.15 }}
//                   className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto"
//                 >
//                   {loadingSuggestions ? (
//                     <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
//                       <div className="w-3.5 h-3.5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
//                       Searching...
//                     </div>
//                   ) : (
//                     <ul>
//                       {suggestions.map((product, idx) => {
//                         const name = product.name || product.title || "Unknown Product";
//                         const category = product.category?.name || product.categoryName || "";
//                         const price = product.price ?? product.basePrice ?? null;
//                         const image = product.image || product.imageUrl || product.thumbnail || null;

//                         return (
//                           <li
//                             key={product._id || product.id || idx}
//                             onMouseDown={() => handleSelectSuggestion(product)}
//                             onTouchEnd={() => handleSelectSuggestion(product)}
//                             onMouseEnter={() => setActiveIndex(idx)}
//                             className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-sm transition-colors
//                               ${activeIndex === idx ? "bg-green-50" : "hover:bg-gray-50"}`}
//                           >
//                             <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
//                               {image ? (
//                                 <img src={image} alt={name} className="w-full h-full object-cover" />
//                               ) : (
//                                 <Leaf className="w-4 h-4 text-green-400" />
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-gray-800 truncate">{name}</p>
//                               {category && (
//                                 <p className="text-xs text-gray-400 truncate">{category}</p>
//                               )}
//                             </div>
//                             {price !== null && (
//                               <span className="text-xs font-semibold text-green-600 whitespace-nowrap">
//                                 ₹{price}
//                               </span>
//                             )}
//                           </li>
//                         );
//                       })}
//                       <li
//                         onMouseDown={handleSearch}
//                         onTouchEnd={handleSearch}
//                         className="px-4 py-2.5 text-xs text-center text-green-600 font-medium hover:bg-green-50 cursor-pointer border-t border-gray-100"
//                       >
//                         See all results for "{searchQuery}"
//                       </li>
//                     </ul>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </motion.header>
//     </>
//   );
// };

// export default Header;
