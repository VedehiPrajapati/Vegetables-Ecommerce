import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const SemicircleFooter = () => {
  return (
    <footer className="mt-16 relative">
      <div className="semicircle-footer bg-primary text-primary-foreground pt-16 pb-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <Leaf className="w-6 h-6" />
                <span className="font-display text-2xl font-bold">
                  Fresh<span className="text-accent">Cart</span>
                </span>
              </div>
              <p className="text-sm opacity-80 max-w-xs mx-auto md:mx-0">
                Delivering the freshest vegetables and fruits straight from local farms to your doorstep.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="hover:opacity-100 transition-opacity cursor-pointer">About Us</li>
                <li className="hover:opacity-100 transition-opacity cursor-pointer">Our Farms</li>
                <li className="hover:opacity-100 transition-opacity cursor-pointer">Delivery Info</li>
                <li className="hover:opacity-100 transition-opacity cursor-pointer">Return Policy</li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-display font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm opacity-80">
                <li className="flex items-center gap-2 justify-center md:justify-end">
                  <Phone className="w-4 h-4" /> +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-end">
                  <Mail className="w-4 h-4" /> hello@freshcart.com
                </li>
                <li className="flex items-center gap-2 justify-center md:justify-end">
                  <MapPin className="w-4 h-4" /> 123 Green Valley, CA
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-6 text-center text-sm opacity-60">
            © 2026 FreshCart. All rights reserved. Made with 💚
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SemicircleFooter;
