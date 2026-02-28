import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Calendar, Clock, MapPin, ChevronRight, Loader2, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import Header from "@/components/Header";
import SemicircleFooter from "@/components/SemicircleFooter";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/my");
                setOrders(res.data.data);
            } catch (error) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-amber-100 text-amber-600 border-amber-200";
            case "processing": return "bg-blue-100 text-blue-600 border-blue-200";
            case "shipped": return "bg-indigo-100 text-indigo-600 border-indigo-200";
            case "delivered": return "bg-green-100 text-green-600 border-green-200";
            case "cancelled": return "bg-rose-100 text-rose-600 border-rose-200";
            default: return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <Header />
                <main className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-10">
                            <Skeleton className="w-12 h-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-48 rounded-md" />
                                <Skeleton className="h-4 w-64 rounded-md" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-14 h-14 rounded-2xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-6 w-32 rounded-md" />
                                                <Skeleton className="h-4 w-48 rounded-md" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-8 w-24 rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24 rounded-md" />
                                            <Skeleton className="h-5 w-full rounded-md" />
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent">
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-16 rounded-md" />
                                                <Skeleton className="h-8 w-24 rounded-md" />
                                            </div>
                                            <Skeleton className="w-12 h-12 rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
                <SemicircleFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header Section */}
                    <div className="flex items-center gap-4 mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-primary"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                                Order <span className="text-primary italic">History</span>
                            </h1>
                            <p className="text-slate-500">Track and manage your fresh harvest deliveries</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-16 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 text-center space-y-6">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <ShoppingBag className="w-12 h-12" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">No orders yet</h2>
                            <p className="text-slate-500 max-w-xs mx-auto">Looks like you haven't placed any orders. Start shopping for fresh vegetables now!</p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                Shop Now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {orders.map((order, index) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all group"
                                    >
                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                                        <Package className="w-7 h-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-black text-slate-900 dark:text-white">Order #{order.orderNumber || order._id.slice(-6).toUpperCase()}</h3>
                                                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-3">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</span>
                                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                                                {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.postalCode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
                                                        <span className="text-2xl font-black text-primary">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                                                    </div>
                                                    <button className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                                        <ChevronRight className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>
            </main>
            <SemicircleFooter />
        </div>
    );
};

export default Orders;
