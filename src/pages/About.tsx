import { Leaf, Truck, ShieldCheck, Heart, TrendingUp, Users } from "lucide-react";
import aboutHero from "@/assets/banner1.jpg"; // you can change image
import farmImage from "@/assets/banner2.jpg";
import Header  from "@/components/Header";
import SemicircleFooter from "@/components/SemicircleFooter";
import banner1 from "@/assets/banner1.jpg";
import banner3 from "@/assets/banner1.jpg";

const values = [
  { icon: Leaf, title: "Farm Fresh Quality", description: "We source directly from trusted farms, ensuring every fruit and vegetable reaches you at peak freshness." },
  { icon: Truck, title: "Reliable Bulk Supply", description: "Cold-chain logistics and timely delivery so your business never runs short on fresh produce." },
  { icon: ShieldCheck, title: "Quality Assurance", description: "Rigorous multi-point quality checks at every stage — from harvest to your doorstep." },
  { icon: TrendingUp, title: "Competitive Pricing", description: "Direct farm partnerships eliminate middlemen, passing savings on to you." },
  { icon: Users, title: "Dedicated Support", description: "A personal account manager for every client, available 7 days a week." },
  { icon: Heart, title: "Sustainability First", description: "Eco-friendly packaging and reduced food waste through smart supply chain management." },
];


const stats = [
  { value: "10+", label: "Years in Business" },
  { value: "500+", label: "Bulk Clients Served" },
  { value: "50+", label: "Produce Varieties" },
  { value: "100K+", label: "Tonnes Delivered" },
];
const About = () => {
  
  return (
    
    <div className="w-full bg-background text-foreground">
    <Header />
      {/* 🔹 HERO SECTION */}
      <section className="relative h-[420px] flex items-center justify-center text-center">
        <img
          src={aboutHero}
          alt="Fresh Vegetables"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About FreshCart
          </h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Delivering farm-fresh vegetables and fruits directly to your home with love, trust, and quality.
          </p>
        </div>
      </section>

       

      {/* 🔹 WHO WE ARE */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              FreshCart is a modern online grocery platform focused on delivering
              fresh, organic, and high-quality produce straight from local farmers
              to your doorstep.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We eliminate middlemen and ensure that farmers receive fair prices
              while customers enjoy farm-fresh food at affordable rates.
            </p>
          </div>

          <div>
            <img
              src={farmImage}
              alt="Farm to Home"
              className="rounded-3xl shadow-2xl object-cover w-full h-[350px]"
            />
          </div>

        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-8">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">{stat.value}</p>
              <p className="text-sm text-primary-foreground/80 mt-1 font-body">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 MISSION SECTION */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            Our mission is to create a transparent and sustainable food ecosystem
            that connects farmers directly with consumers. We aim to promote
            healthy living, reduce food waste, and support local agriculture.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24" style={{ background: "var(--section-gradient)" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="text-sm font-semibold uppercase tracking-wider text-secondary font-body">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6 font-display">
                From Local Farms to Your Business
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 font-body">
                Founded with a simple mission — to bridge the gap between hardworking farmers and businesses that need fresh, high-quality produce in bulk. We started as a small cooperative and have grown into one of the region's most trusted wholesale suppliers.
              </p>
              <p className="text-muted-foreground leading-relaxed font-body">
                Today, we partner with over 200 farms across the country, bringing the freshest seasonal fruits and vegetables directly to restaurants, hotels, supermarkets, and catering businesses. Our cold-chain infrastructure ensures that every delivery maintains the quality your customers expect.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={banner3} alt="Fresh produce at the farm" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary font-body">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 font-display">
              Built on Trust, Delivered with Care
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <v.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-body">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" style={{ background: "var(--section-gradient)" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img src={banner1} alt="Our team at the warehouse" className="w-full h-full object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-secondary font-body">Our Operations</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6 font-display">
                State-of-the-Art Facility
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 font-body">
                Our 50,000 sq. ft. sorting and distribution center is equipped with modern cold storage, automated grading machines, and hygiene-first processing lines. Every order is inspected before dispatch.
              </p>
              <p className="text-muted-foreground leading-relaxed font-body">
                With a dedicated team of 100+ professionals — from agronomists to logistics experts — we ensure that quality is never compromised, no matter the scale of your order.
              </p>
            </div>
          </div>
        </div>
      </section>
      

      {/* 🔹 WHY CHOOSE US */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose FreshCart?
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="bg-card p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
            <Leaf className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">100% Fresh</h3>
            <p className="text-sm text-muted-foreground">
              Directly sourced from farms daily to ensure maximum freshness.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
            <Truck className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Quick and reliable doorstep delivery within your city.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
            <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Quality Checked</h3>
            <p className="text-sm text-muted-foreground">
              Every product goes through strict quality inspection.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition">
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Customer First</h3>
            <p className="text-sm text-muted-foreground">
              We prioritize customer satisfaction above everything.
            </p>
          </div>

        </div>
      </section>

      {/* 🔹 FOOTER CTA */}
      
      <SemicircleFooter/>
    </div>
  );
};

export default About;