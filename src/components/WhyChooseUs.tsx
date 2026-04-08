import { Truck, Shield, Leaf, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Leaf,
    title: "Farm Fresh Quality",
    desc: "Directly sourced from farms and mandis for maximum freshness",
  },
  {
    icon: Truck,
    title: "Fast Bulk Delivery",
    desc: "Reliable next-day delivery for all bulk orders",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    desc: "Strict quality checks to ensure premium-grade produce",
  },
  {
    icon: Clock,
    title: "Early Morning Supply",
    desc: "Get fresh stock delivered early morning for your business needs",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 md:py-14 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title text-center mb-8">Why Choose FreshCart?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-border"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
