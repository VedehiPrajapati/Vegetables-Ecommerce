import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Home, Building2, Send, Loader2, CreditCard, ShoppingBag, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { Skeleton } from "@/components/ui/skeleton";

interface AddressDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddressDialog = ({ isOpen, onClose }: AddressDialogProps) => {
    const [areas, setAreas] = useState<any[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        area: "",
        address: "",
        city: "Pune",
        postalCode: "",
    });

    const { checkout, totalAmount, setCartOpen } = useCartStore();

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            const fetchAreas = async () => {
                try {
                    const res = await api.get("/areas/public");
                    const fetchedAreas = res.data.data;
                    setAreas(fetchedAreas);
                    if (fetchedAreas && fetchedAreas.length > 0) {
                        setFormData((prev) => ({ ...prev, area: fetchedAreas[0]._id }));
                    }
                } catch (error) {
                    toast.error("Failed to fetch available areas");
                } finally {
                    setLoadingAreas(false);
                }
            };
            fetchAreas();
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.area || !formData.address || !formData.city) {
            toast.error("Please fill in all required fields to proceed");
            return;
        }

        setIsSubmitting(true);
        try {
            const orderPayload = {
                area: formData.area,
                deliveryAddress: {
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    location: {
                        lat: 19.076,
                        lng: 72.8777,
                    },
                },
            };
            await checkout(orderPayload);
            setStep(2); // Success step
            setTimeout(() => {
                onClose();
                setCartOpen(false);
            }, 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong while placing your order");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] transition-all duration-500"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {step === 1 ? (
                                <>
                                    {/* Header Section */}
                                    <div className="p-8 pb-4 flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-8 h-1 bg-primary rounded-full" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Checkout</span>
                                            </div>
                                            <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                                Delivery <span className="text-primary italic">Details</span>
                                            </h2>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={onClose}
                                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all"
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.button>
                                    </div>

                                    <div className="px-8 mb-4">
                                        <div className="flex items-center gap-4 bg-primary/5 p-4 rounded-[24px] border border-primary/10">
                                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">Shipping Address</span>
                                                <span className="text-xs text-slate-500">We currently deliver only in Mumbai city.</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Section */}
                                    <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-8 overflow-y-auto max-h-[70vh]">
                                        <div className="space-y-6">
                                            {/* Area Select */}
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                                                    Service Area
                                                </label>
                                                {loadingAreas ? (
                                                    <Skeleton className="w-full h-14 rounded-2xl" />
                                                ) : (
                                                    <div className="relative group">
                                                        <select
                                                            value={formData.area}
                                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                                            className="w-full h-14 pl-12 pr-12 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-primary/50 rounded-2xl outline-none transition-all appearance-none cursor-pointer font-bold text-slate-900 dark:text-white"
                                                        >
                                                            {areas.map((area) => (
                                                                <option key={area._id} value={area._id}>
                                                                    {area.name} — {area.city}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Address Textarea */}
                                            <div>
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                                                    Complete Address
                                                </label>
                                                <div className="relative group">
                                                    <Home className="absolute left-4 top-4 w-5 h-5 text-primary group-focus-within:scale-110 transition-transform" />
                                                    <textarea
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        placeholder="Your house number, street name, and nearby landmark..."
                                                        required
                                                        className="w-full h-32 pl-12 pr-6 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-primary/50 rounded-[24px] outline-none transition-all resize-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400/60 placeholder:font-medium"
                                                    />
                                                </div>
                                            </div>

                                            {/* Grid Inputs */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                                        <input
                                                            type="text"
                                                            value={formData.city}
                                                            readOnly
                                                            className="w-full h-14 pl-10 pr-4 bg-slate-100 dark:bg-slate-800 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed border-2 border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                                                    <input
                                                        type="text"
                                                        value={formData.postalCode}
                                                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                                        placeholder="400001"
                                                        maxLength={6}
                                                        className="w-full h-14 px-5 bg-slate-100 dark:bg-slate-900 border-2 border-transparent focus:border-primary/50 rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-400/40"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing and Action Footer */}
                                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Total</span>
                                                </div>
                                                <span className="text-4xl font-black text-primary">
                                                    ₹{Number(totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting || loadingAreas}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full sm:w-auto h-16 px-10 bg-primary text-white rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-[0_12px_24px_-8px_rgba(30,190,120,0.5)] transition-all hover:shadow-[0_20px_40px_-12px_rgba(30,190,120,0.6)] disabled:opacity-50 disabled:grayscale"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-7 h-7 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-6 h-6" />
                                                        <span>Place Order</span>
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                /* Success State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-12 flex flex-col items-center text-center py-20"
                                >
                                    <div className="relative mb-8">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", delay: 0.2 }}
                                            className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-primary" />
                                        </motion.div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-primary rounded-full"
                                        />
                                    </div>
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                                        Order <span className="text-primary italic">Confirmed!</span>
                                    </h3>
                                    <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">
                                        Your fresh harvest is being prepared for delivery. Expect a call from our captain soon!
                                    </p>
                                    <div className="mt-10 flex items-center gap-2 p-3 px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <ShoppingBag className="w-3 h-3" />
                                        Closing in 3 seconds...
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddressDialog;
