import {
  ShoppingCart,
  LogOut,
  Search,
  Leaf,
  MapPin,
  LogIn,
  User as UserIcon,
  Package,
  ChevronDown,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/services/api";
import { toast } from "sonner";

const Header = () => {
  const { totalItems, fetchCart, setCartOpen } = useCartStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [selectedLocation, setSelectedLocation] = useState("Select Area");
  const [areas, setAreas] = useState<any[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get("/areas/public");
        setAreas(response.data.data);
      } catch (error) {
        console.error("Fetch areas error:", error);
      }
    };
    fetchAreas();
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 🔥 Scroll to Footer
  const handleContactScroll = () => {
    const footer = document.getElementById("contact");
    if (footer) {
      const yOffset = -80; // adjust if header height changes
      const y =
        footer.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 🔹 TOP STRIP */}
      <div className="w-full bg-gray-50 text-sm text-gray-700 border-b">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-10">

          {/* Left Side */}
          <div className="flex items-center gap-2">
            <button className="hover:underline">
              Why FreshCart?
            </button>
            <span className="text-lg">🍎</span>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/about" className="hover:underline">
              About Us
            </Link>

            <button className="hover:underline">
              Careers@FreshCart
            </button>

            <button
              onClick={handleContactScroll}
              className="hover:underline"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 MAIN HEADER */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-20">

          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Leaf className="w-7 h-7 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">
                Fresh<span className="text-accent">Cart</span>
              </span>
            </div>

            {/* Location Picker */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowLocationDropdown(!showLocationDropdown)
                }
                className="flex items-center gap-1.5 text-sm bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-full transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span className="text-foreground font-medium hidden sm:inline">
                  {selectedLocation}
                </span>
              </button>

              {showLocationDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() =>
                      setShowLocationDropdown(false)
                    }
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 py-2 w-44 max-h-60 overflow-y-auto"
                  >
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <button
                          key={area._id}
                          onClick={() => {
                            setSelectedLocation(area.name);
                            setShowLocationDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${area.name === selectedLocation
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-foreground hover:bg-secondary"
                            }`}
                        >
                          {area.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-xs text-muted-foreground italic">Loading areas...</div>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search fresh produce..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-full text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-secondary hover:bg-primary/10 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 group outline-none">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="hidden md:flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Explorer</span>
                      <span className="text-sm font-bold text-foreground">{user.name.split(' ')[0]}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors group-data-[state=open]:rotate-180 transition-transform" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 p-2 rounded-[24px] border-border/50 shadow-2xl backdrop-blur-xl bg-card/95 z-[100]">
                  <DropdownMenuLabel className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-black uppercase tracking-widest text-primary/60">Account</p>
                      <p className="text-sm font-bold truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50 mx-2" />
                  <DropdownMenuGroup className="p-1">
                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors group"
                    >
                      <UserIcon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">My Profile</span>
                      <span className="ml-auto text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">New</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/orders")}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors group"
                    >
                      <Package className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">My Orders</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-not-allowed opacity-50 focus:bg-primary/5 focus:text-primary transition-colors group"
                    >
                      <Settings className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-sm">Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-border/50 mx-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl focus:bg-destructive/5 focus:text-destructive text-destructive transition-colors cursor-pointer group"
                  >
                    <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span className="font-bold text-sm">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;