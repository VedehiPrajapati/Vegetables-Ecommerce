// import { Leaf, Mail, Phone, MapPin } from "lucide-react";

// const SemicircleFooter = () => {
//   return (
//     <footer className="mt-16 relative">
//       <div className="semicircle-footer bg-primary text-primary-foreground pt-16 pb-8 px-4">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//             <div className="text-center md:text-left">
//               <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
//                 <Leaf className="w-6 h-6" />
//                 <span className="font-display text-2xl font-bold">
//                   Fresh<span className="text-accent">Cart</span>
//                 </span>
//               </div>
//               <p className="text-sm opacity-80 max-w-xs mx-auto md:mx-0">
//                 Delivering the freshest vegetables and fruits straight from local farms to your doorstep.
//               </p>
//             </div>
//             <div className="text-center">
//               <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-sm opacity-80">
//                 <li className="hover:opacity-100 transition-opacity cursor-pointer">About Us</li>
//                 <li className="hover:opacity-100 transition-opacity cursor-pointer">Our Farms</li>
//                 <li className="hover:opacity-100 transition-opacity cursor-pointer">Delivery Info</li>
//                 <li className="hover:opacity-100 transition-opacity cursor-pointer">Return Policy</li>
//               </ul>
//             </div>
//             <div className="text-center md:text-right">
//               <h4 className="font-display font-bold text-lg mb-4">Contact Us</h4>
//               <ul className="space-y-3 text-sm opacity-80">
//                 <li className="flex items-center gap-2 justify-center md:justify-end">
//                   <Phone className="w-4 h-4" /> +1 (555) 123-4567
//                 </li>
//                 <li className="flex items-center gap-2 justify-center md:justify-end">
//                   <Mail className="w-4 h-4" /> hello@freshcart.com
//                 </li>
//                 <li className="flex items-center gap-2 justify-center md:justify-end">
//                   <MapPin className="w-4 h-4" /> 123 Green Valley, CA
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60">
//             © 2026 FreshCart. All rights reserved. Made with 💚
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default SemicircleFooter;

import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#0B1A2B] text-white pt-14 pb-6 px-4">
      <div className="container mx-auto">
        
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">FreshBulk</h2>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              The trusted B2B wholesale platform for commercial kitchens,
              hotels, and retailers to source premium fresh produce in bulk
              at daily market rates.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <Facebook size={16} />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <Twitter size={16} />
              </div>
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer">
                <Instagram size={16} />
              </div>
            </div>
          </div>

          {/* SHOP CATEGORIES */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide text-gray-200">
              SHOP CATEGORIES
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Onion, Potato & Garlic</li>
              <li className="hover:text-white cursor-pointer">Tomatoes & Chilies</li>
              <li className="hover:text-white cursor-pointer">Leafy Greens</li>
              <li className="hover:text-white cursor-pointer">Exotic Veggies</li>
              <li className="hover:text-white cursor-pointer">Fresh Fruits</li>
            </ul>
          </div>

          {/* BUSINESS */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide text-gray-200">
              FOR BUSINESS
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Live Market Prices</li>
              <li className="hover:text-white cursor-pointer">Delivery Guidelines</li>
              <li className="hover:text-white cursor-pointer">Quality Standards</li>
              <li className="hover:text-white cursor-pointer">Partner Farms</li>
              <li className="hover:text-white cursor-pointer">Open Corporate Account</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-sm font-semibold mb-4 tracking-wide text-gray-200">
              CONTACT SUPPORT
            </h4>

            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone size={14} /> 1800-123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> support@freshbulk.com
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-1" />
                FreshBulk Hub,<br />
                Wholesale Market Area,<br />
                Sector 4, New City.
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">

          {/* LEFT */}
          <p>
            © 2025 FreshBulk Supply. All rights reserved for B2B Wholesale.
          </p>

          {/* RIGHT */}
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Refund Policy</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;