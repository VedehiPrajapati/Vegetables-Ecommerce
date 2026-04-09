import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Calendar, Clock, MapPin, ChevronRight, ArrowLeft, ShoppingBag, CheckCircle2, Truck, Timer } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import Header from "@/components/Header";
import SemicircleFooter from "@/components/SemicircleFooter";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const STAGES = ["pending", "processing", "shipped", "delivered"];

// ✅ STATUS MAP
const mapStatus = (status: string) => {
    switch (status?.toLowerCase()) {
        case "placed": return "pending";
        case "processing": return "processing";
        case "shipped": return "shipped";
        case "delivered": return "delivered";
        case "cancelled": return "cancelled";
        default: return "pending";
    }
};

const Orders = () => {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/my");

                const formatted = (res.data.data || []).map((order: any) => ({
                    ...order,
                    mappedStatus: mapStatus(order.status),
                    finalAmountSafe: order.finalAmount || order.totalAmount || 0
                }));

                setOrders(formatted);
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

    const getStageIndex = (status: string) => {
        if (status === "cancelled") return -1;
        const index = STAGES.indexOf(status);
        return index !== -1 ? index : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <main className="container mx-auto px-4 md:px-6 py-12">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <Skeleton className="h-12 w-64 rounded-xl" />
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-[32px]" />
                        ))}
                    </div>
                </main>
                <SemicircleFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-slate-500 hover:text-green-600 group"
                        >
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                Order <span className="text-green-600 ">History</span>
                            </h1>
                            <p className="text-slate-500 mt-1">Track and manage your fresh harvest deliveries</p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No orders yet
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {orders.map((order, index) => {
                                    const status = order.mappedStatus;
                                    const currentStageIdx = getStageIndex(status);
                                    const isCancelled = status === "cancelled";
                                    const isExpanded = expandedOrder === order._id;

                                    return (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1, duration: 0.4 }}
                                            className="bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-lg transition-all duration-300"
                                        >
                                            <div className="p-6 md:p-8 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>

                                                {/* TOP */}
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-gray-500  ">
                                                            <Package className="w-7 h-7" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-black text-slate-900">
                                                                Order #{order.orderNumber}
                                                            </h3>
                                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase mt-1">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                                <Clock className="w-3.5 h-3.5 ml-2" />
                                                                {new Date(order.createdAt).toLocaleTimeString()}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={`
  /* Layout: Shrink to fit text width */
  w-fit whitespace-nowrap 
  
  /* Mobile Styles (Default) */
  px-2.5 py-0.5 text-[10px] rounded-full font-bold border
  
  /* Desktop Styles (md and up) */
  md:px-4 md:py-1 md:text-xs
  
  ${getStatusColor(status)}
`}>
  {order.status}
</div>
                                                </div>

                                                {/* ADDRESS + TOTAL */}
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin size={16} />
                                                        {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                                                    </div>

                                                    <div className="text-xl font-bold">
                                                        ₹{order.finalAmountSafe.toLocaleString("en-IN")}
                                                    </div>
                                                </div>

                                                {/* ITEMS */}
                                                <div className="space-y-2 mb-4">
                                                    {order.items?.map((item: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-3 text-sm">
                                                            <img src={item.image} className="w-10 h-10 rounded object-cover" />
                                                            <div className="flex-1">{item.name}</div>
                                                            <div className="text-gray-500">
                                                                {item.quantity} x ₹{item.priceAtOrderTime}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* 🔥 ORIGINAL TIMELINE (UNCHANGED) */}
                                                <AnimatePresence>
                                                    {isExpanded && !isCancelled && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                                                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="pt-4 border-t border-slate-100">
                                                                <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">
                                                                    Order Timeline
                                                                </h4>

                                                                <div className="relative flex items-center justify-between px-4 md:px-12">
                                                                    <div className="absolute left-[10%] right-[10%] md:left-[15%] md:right-[15%] top-5 h-1 bg-slate-100 rounded-full" />

                                                                    <div
                                                                        className="absolute left-[10%] md:left-[15%] top-5 h-1 bg-green-500 rounded-full transition-all duration-700"
                                                                        style={{
                                                                            width: `${Math.max(0, (currentStageIdx / (STAGES.length - 1)) * 80)}%`
                                                                        }}
                                                                    />

                                                                    {STAGES.map((stage, idx) => {
                                                                        const isCompleted = currentStageIdx >= idx;
                                                                        const isCurrent = currentStageIdx === idx;

                                                                        return (
                                                                            <div key={stage} className="relative flex flex-col items-center gap-3 z-10">
                                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white
                                                                                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}
                                                                                    ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}
                                                                                `}>
                                                                                    {stage === 'pending' && <Timer className="w-5 h-5" />}
                                                                                    {stage === 'processing' && <Package className="w-5 h-5" />}
                                                                                    {stage === 'shipped' && <Truck className="w-5 h-5" />}
                                                                                    {stage === 'delivered' && <CheckCircle2 className="w-5 h-5" />}
                                                                                </div>

                                                                                <span className={`text-xs font-bold ${isCompleted ? 'text-green-600' : 'text-slate-400'}`}>
                                                                                    {stage}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                            </div>
                                        </motion.div>
                                    );
                                })}
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