export type Product = {
  id: string;
  slug: string; // URL identifier
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  unit: string;
  organic: boolean;
  rating: number;
  description: string;
};

export type CartItem = Product & {
  quantity: number;
};

export const categories = [
  { id: "vegetables", name: "Vegetables", emoji: "🥦", color: "from-primary/20 to-primary/5" },
  { id: "fruits", name: "Fruits", emoji: "🍎", color: "from-accent/20 to-accent/5" },
  { id: "leafy-greens", name: "Leafy Greens", emoji: "🥬", color: "from-success/20 to-success/5" },
  { id: "exotic", name: "Exotic Fruits", emoji: "🥭", color: "from-accent/30 to-accent/5" },
  { id: "root-vegs", name: "Root Vegetables", emoji: "🥕", color: "from-accent/20 to-primary/5" },
  { id: "herbs", name: "Fresh Herbs", emoji: "🌿", color: "from-primary/30 to-success/10" },
];

// export const products: Product[] = [
//   { 
//     id: 1, 
//     slug: "brocali",
//     name: "Fresh Broccoli", 
//     price: 2.49, 
//     originalPrice: 3.29, 
//     category: "vegetables", 
//     image: "https://images.unsplash.com/photo-1553175005-a1129d5c188c?w=600&auto=format&fit=crop&q=60", 
//     unit: "per head", 
//     organic: true, 
//     rating: 4.8, 
//     description: "Fresh organic broccoli" 
//   },
//   { 
//     id: 2, 
//     slug: "tomatoes",
//     name: "Red Tomatoes", 
//     price: 1.99, 
//     category: "vegetables", 
//     image: "https://images.unsplash.com/photo-1640958904911-65668b264e26?w=600&auto=format&fit=crop&q=60", 
//     unit: "per lb", 
//     organic: true, 
//     rating: 4.6, 
//     description: "Vine-ripened red tomatoes" 
//   },
//   { 
//     id: 3, 
//     slug: "fresh-spinach",
//     name: "Fresh Spinach", 
//     price: 3.49, 
//     category: "leafy-greens", 
//     image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop", 
//     unit: "per bunch", 
//     organic: true, 
//     rating: 4.9, 
//     description: "Baby spinach leaves" 
//   },
//   { 
//     id: 4, 
//     slug: "sweet-mangoes",
//     name: "Sweet Mangoes", 
//     price: 2.99, 
//     originalPrice: 3.99, 
//     category: "exotic", 
//     image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", 
//     unit: "each", 
//     organic: false, 
//     rating: 4.7, 
//     description: "Alphonso mangoes" 
//   },
//   { 
//     id: 5, 
//     slug: "organic-carrots",
//     name: "Organic Carrots", 
//     price: 1.79, 
//     category: "root-vegs", 
//     image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop", 
//     unit: "per lb", 
//     organic: true, 
//     rating: 4.5, 
//     description: "Fresh organic carrots" 
//   },
//   { 
//     id: 6, 
//     slug: "strawberries",
//     name: "Strawberries", 
//     price: 4.99, 
//     originalPrice: 5.99, 
//     category: "fruits", 
//     image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop", 
//     unit: "per box", 
//     organic: true, 
//     rating: 4.9, 
//     description: "Sweet fresh strawberries" 
//   },
//   { 
//     id: 7, 
//     slug: "green-bell-pepper",
//     name: "Green Bell Pepper", 
//     price: 1.49, 
//     category: "vegetables", 
//     image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop", 
//     unit: "each", 
//     organic: false, 
//     rating: 4.3, 
//     description: "Crisp green bell peppers" 
//   },
//   { 
//     id: 8, 
//     slug: "fresh-basil",
//     name: "Fresh Basil", 
//     price: 2.29, 
//     category: "herbs", 
//     image: "https://plus.unsplash.com/premium_photo-1673264299391-8ca6b2b1a667?w=600&auto=format&fit=crop&q=60", 
//     unit: "per bunch", 
//     organic: true, 
//     rating: 4.7, 
//     description: "Aromatic fresh basil" 
//   },
//   { 
//     id: 9, 
//     slug: "red-apples",
//     name: "Red Apples", 
//     price: 3.29, 
//     category: "fruits", 
//     image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop", 
//     unit: "per lb", 
//     organic: true, 
//     rating: 4.6, 
//     description: "Crisp red apples" 
//   },
//   { 
//     id: 10, 
//     slug: "fresh-cucumbers",
//     name: "Fresh Cucumbers", 
//     price: 0.99, 
//     category: "vegetables", 
//     image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop", 
//     unit: "each", 
//     organic: false, 
//     rating: 4.4, 
//     description: "Cool fresh cucumbers" 
//   },
//   { 
//     id: 11, 
//     slug: "blueberries",
//     name: "Blueberries", 
//     price: 5.49, 
//     category: "fruits", 
//     image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop", 
//     unit: "per box", 
//     organic: true, 
//     rating: 4.8, 
//     description: "Plump fresh blueberries" 
//   },
//   { 
//     id: 12, 
//     slug: "sweet-potatoes",
//     name: "Sweet Potatoes", 
//     price: 2.19, 
//     category: "root-vegs", 
//     image: "https://images.unsplash.com/photo-1730815048561-45df6f7f331d?w=600&auto=format&fit=crop&q=60", 
//     unit: "per lb", 
//     organic: false, 
//     rating: 4.5, 
//     description: "Organic sweet potatoes" 
//   },
// ];

// export type Product = {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   category: string;
//   image: string;
//   unit: string;
//   organic: boolean;
//   rating: number;
//   description: string;
// };

// export const categories = [
//   { id: "vegetables", name: "Vegetables", emoji: "🥦", color: "from-primary/20 to-primary/5" },
//   { id: "fruits", name: "Fruits", emoji: "🍎", color: "from-accent/20 to-accent/5" },
//   { id: "leafy-greens", name: "Leafy Greens", emoji: "🥬", color: "from-success/20 to-success/5" },
//   { id: "exotic", name: "Exotic Fruits", emoji: "🥭", color: "from-accent/30 to-accent/5" },
//   { id: "root-vegs", name: "Root Vegetables", emoji: "🥕", color: "from-accent/20 to-primary/5" },
//   { id: "herbs", name: "Fresh Herbs", emoji: "🌿", color: "from-primary/30 to-success/10" },
// ];

// export const products: Product[] = [
//   { id: 1, name: "Fresh Broccoli", price: 2.49, originalPrice: 3.29, category: "vegetables", image: "https://images.unsplash.com/photo-1553175005-a1129d5c188c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YnJvY29saXxlbnwwfHwwfHx8MA%3D%3D", unit: "per head", organic: true, rating: 4.8, description: "Fresh organic broccoli" },
//   { id: 2, name: "Red Tomatoes", price: 1.99, category: "vegetables", image: "https://images.unsplash.com/photo-1640958904911-65668b264e26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVkJTIwdG9tYXRvZXN8ZW58MHx8MHx8fDA%3D", unit: "per lb", organic: true, rating: 4.6, description: "Vine-ripened red tomatoes" },
//   { id: 3, name: "Fresh Spinach", price: 3.49, category: "leafy-greens", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop", unit: "per bunch", organic: true, rating: 4.9, description: "Baby spinach leaves" },
//   { id: 4, name: "Sweet Mangoes", price: 2.99, originalPrice: 3.99, category: "exotic", image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop", unit: "each", organic: false, rating: 4.7, description: "Alphonso mangoes" },
//   { id: 5, name: "Organic Carrots", price: 1.79, category: "root-vegs", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop", unit: "per lb", organic: true, rating: 4.5, description: "Fresh organic carrots" },
//   { id: 6, name: "Strawberries", price: 4.99, originalPrice: 5.99, category: "fruits", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop", unit: "per box", organic: true, rating: 4.9, description: "Sweet fresh strawberries" },
//   { id: 7, name: "Green Bell Pepper", price: 1.49, category: "vegetables", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&h=400&fit=crop", unit: "each", organic: false, rating: 4.3, description: "Crisp green bell peppers" },
//   { id: 8, name: "Fresh Basil", price: 2.29, category: "herbs", image: "https://plus.unsplash.com/premium_photo-1673264299391-8ca6b2b1a667?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZnJlc2glMjBiYXNpbHxlbnwwfHwwfHx8MA%3D%3D", unit: "per bunch", organic: true, rating: 4.7, description: "Aromatic fresh basil" },
//   { id: 9, name: "Red Apples", price: 3.29, category: "fruits", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop", unit: "per lb", organic: true, rating: 4.6, description: "Crisp red apples" },
//   { id: 10, name: "Fresh Cucumbers", price: 0.99, category: "vegetables", image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop", unit: "each", organic: false, rating: 4.4, description: "Cool fresh cucumbers" },
//   { id: 11, name: "Blueberries", price: 5.49, category: "fruits", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&h=400&fit=crop", unit: "per box", organic: true, rating: 4.8, description: "Plump fresh blueberries" },
//   { id: 12, name: "Sweet Potatoes", price: 2.19, category: "root-vegs", image: "https://images.unsplash.com/photo-1730815048561-45df6f7f331d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dlZXQlMjBwb3RhdG98ZW58MHx8MHx8fDA%3D", unit: "per lb", organic: false, rating: 4.5, description: "Organic sweet potatoes" },
// ];
