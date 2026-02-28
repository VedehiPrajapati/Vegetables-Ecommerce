import { create } from 'zustand';
import api from '@/services/api';

interface CartItem {
    _id: string;
    product: {
        _id: string;
        name: string;
        offerPrice: number;
        mainImage: { secure_url: string };
        unit: string;
    };
    quantity: number;
    priceAtOrderTime: number;
}

interface CartState {
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    loading: boolean;
    isCartOpen: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => void;
    setCartOpen: (open: boolean) => void;
    checkout: (orderData: any) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    loading: false,
    isCartOpen: false,

    setCartOpen: (open: boolean) => set({ isCartOpen: open }),

    fetchCart: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/cart');
            const cart = response.data.data;
            set({
                items: cart.items,
                totalItems: cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
                totalAmount: cart.totalAmount,
            });
        } catch (error) {
            console.error('Fetch cart error:', error);
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (productId, quantity) => {
        try {
            await api.post('/cart/add', { productId, quantity });
            await get().fetchCart();
        } catch (error) {
            console.error('Add to cart error:', error);
            throw error;
        }
    },

    updateQuantity: async (productId, quantity) => {
        try {
            await api.patch('/cart/update', { productId, quantity });
            await get().fetchCart();
        } catch (error) {
            console.error('Update quantity error:', error);
            throw error;
        }
    },

    removeItem: async (productId) => {
        try {
            await api.delete(`/cart/remove/${productId}`);
            await get().fetchCart();
        } catch (error) {
            console.error('Remove item error:', error);
            throw error;
        }
    },

    clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),
    checkout: async (orderData) => {
        try {
            await api.post('/orders', orderData);
            get().clearCart();
        } catch (error) {
            console.error('Checkout error:', error);
            throw error;
        }
    },
}));
