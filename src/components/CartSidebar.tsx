import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AddressDialog from "./AddressDialog";

const CartSidebar = () => {
  const {
    items,
    totalItems,
    totalAmount,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
    loading
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to place an order");
      setCartOpen(false);
      navigate("/login");
      return;
    }
    setCartOpen(false);
    setIsAddressOpen(true);
  };

  const handleUpdateQty = async (id: string, newQty: number) => {
    if (newQty < 1) {
      await removeItem(id);
      return;
    }
    try {
      await updateQuantity(id, newQty);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-[110] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold text-foreground">Your Cart</h2>
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{totalItems}</span>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {loading && items.length === 0 ? (
                  <div className="flex items-center justify-center h-full italic opacity-50">Refreshing cart...</div>
                ) : items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground font-medium">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">Add some fresh produce!</p>
                  </div>
                ) : (
                  items.map((item, index) => (
                    <motion.div
                      key={item.product?._id || index}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 bg-secondary/50 rounded-2xl p-3 border border-border/50"
                    >
                      <div className="w-20 h-20 rounded-xl bg-card flex items-center justify-center overflow-hidden border border-border/50">
                        <img src={item.product?.mainImage?.secure_url} alt={item.product?.name} className="w-[85%] h-[85%] object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-foreground truncate">{item.product?.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.product?.unit || 'kg'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-1">
                            <button onClick={() => handleUpdateQty(item.product?._id, item.quantity - 1)} className="p-1 hover:text-primary transition-colors hover:bg-secondary rounded-lg">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center text-foreground">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.product?._id, item.quantity + 1)} className="p-1 hover:text-primary transition-colors hover:bg-secondary rounded-lg">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-bold text-sm text-primary">₹{((item.product?.offerPrice || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemove(item.product?._id)} className="self-start p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="p-5 border-t border-border bg-card/50 backdrop-blur-md space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">Total Amount</span>
                      </div>
                      <span className="text-3xl font-black text-primary tracking-tighter">
                        ₹{Number(totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleOrder}
                    className="w-full py-4 bg-primary text-primary-foreground font-black text-lg rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-6 h-6" />
                    Checkout
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-2.5 text-muted-foreground hover:text-destructive font-bold transition-colors text-[10px] uppercase tracking-widest"
                  >
                    Clear Shopping Cart
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AddressDialog
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
      />
    </>
  );
};

export default CartSidebar;
