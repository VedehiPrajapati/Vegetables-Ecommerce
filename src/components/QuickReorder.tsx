import { useEffect, useState } from "react";
import api from "@/services/api";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

type ReorderItem = {
    productId: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    total: number;
    unit: string;
};

const QuickReorder = () => {
    const [items, setItems] = useState<ReorderItem[]>([]);
    const [invoiceId, setInvoiceId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const { addToCart, setCartOpen } = useCartStore(); // ✅ IMPORTANT
    const { isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!token) {
                    setLoading(false);
                    return;
                }

                const res = await api.get("/orders/my", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const orders = res?.data?.data || [];

                if (orders.length === 0) {
                    setItems([]);
                    return;
                }

                // 1. Sort orders (latest first)
                const sortedOrders = orders.sort(
                    (a: any, b: any) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                // 2. Take latest order for invoice display
                const latestOrder = sortedOrders[0];
                setInvoiceId(
                    latestOrder?.orderNumber || latestOrder?._id?.slice(-4)
                );

                // 3. Get ALL items from all orders
                const allItems: ReorderItem[] = sortedOrders.flatMap(
                    (order: any) =>
                        order.items.map((item: any) => {
                            const price = item.priceAtOrderTime || 0;
                            const quantity = item.quantity || 0;

                            return {
                                productId: item.product,
                                name: item.name || "No name",
                                image: item.image || "",
                                quantity,
                                price,
                                total: price * quantity,
                                unit: "kg",
                            };
                        })
                );

                // 4. Take ONLY last 4 items
                const latestItems = allItems.slice(0, 4);

                // 5. Set items
                setItems(latestItems);
            } catch (error: any) {
                console.error("Quick reorder error:", error);
                toast.error("Failed to load quick reorder");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token]);

    // ✅ UPDATED: Add items + OPEN CART SIDEBAR
    const handleRepeat = async (item: ReorderItem) => {
        try {
            // ✅ Add same quantity
            await addToCart(item.productId, item.quantity);

            toast.success("Order added again");

            // ✅ OPEN CART SIDEBAR (MAIN CHANGE)
            setCartOpen(true);
        } catch (err: any) {
            toast.error("Failed to add");
        }
    };

    // 🔐 Not logged in
    if (!isAuthenticated) {
        return null;
    }

    // ⏳ Loading
    if (loading) {
        return (
            <section className="py-6 text-center">
                <p className="text-gray-500">Loading Quick Reorder...</p>
            </section>
        );
    }

    return (
        <section className="py-6 bg-[#f5f7f6]">
            <div className="container mx-auto px-4 md:px-6 mt-11">


                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8 flex items-start gap-3 justify-between"
                >
                    {/* Left Section (Accent + Text) */}
                    <div className="flex items-start gap-3">
                        {/* Left Accent Line */}
                        <div className="w-1 h-10 bg-primary rounded-full mt-1"></div>

                        {/* Text Content */}
                        <div>
                            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                                Quick Reorder
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Based on your recent orders{" "}
                                {invoiceId && `(Inv-#${invoiceId})`}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* EMPTY */}
                {items.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No Orders Yet
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl border hover:shadow-md transition"
                            >
                                {/* IMAGE */}
                                <div className="w-[70px] h-[70px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={item.image || "/placeholder.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* DETAILS */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    {/* NAME */}
                                    <h4 className="text-sm font-semibold text-slate-800 truncate">
                                        {item.name}
                                    </h4>

                                    {/* LAST ORDERED */}
                                    <p className="text-xs text-gray-500">
                                        Last ordered: {item.quantity} {item.unit}
                                    </p>

                                    {/* PRICE ROW */}
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-bold text-slate-900">
                                            ₹{item.price}/{item.unit} today
                                        </span>

                                        {/* REPEAT BUTTON */}
                                        <button
                                            onClick={() => handleRepeat(item)}
                                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-full font-medium"
                                        >
                                            Repeat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default QuickReorder;