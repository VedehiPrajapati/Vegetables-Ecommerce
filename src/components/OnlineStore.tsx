import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import fruits from "@/assets/OnlineStore.png";
import veggies from "@/assets/OnilneStoreVeggies.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay between each child
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const LandingPromo = () => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <main className="w-full overflow-hidden">

        <section className="min-h-screen flex items-center bg-orange-100">
  <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center ">

    {/* LEFT IMAGE (ROTATING + SLIDE IN FROM LEFT) */}
    <motion.div
  initial={{ opacity: 0, x: -150 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{
    type: "tween",
    duration: 0.6,
    ease: "easeInOut",
  }}
  className="flex justify-center"
>
      <img
        src={veggies}
        alt="Fruit Plate"
        className="w-[460px] md:w-[650px] drop-shadow-2xl"
      />
    </motion.div>

    {/* RIGHT CONTENT */}
    <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.h1
    variants={itemVariants}
    className="text-6xl md:text-6xl font-extrabold mb-8"
  >
    Fresh produce, <br /> supplied in bulk
  </motion.h1>

  <motion.p
    variants={itemVariants}
    className="text-muted-foreground mb-6 max-w-lg"
  >
    We specialize in the bulk supply of fresh fruits and vegetables, sourced directly
    from trusted farms and growers.
  </motion.p>

  <motion.p
    variants={itemVariants}
    className="text-muted-foreground mb-6 max-w-lg"
  >
    From local retailers and wholesalers to hotels, restaurants, and catering services,
    we ensure freshness, hygiene, and timely delivery.
  </motion.p>

  <motion.p
    variants={itemVariants}
    className="text-muted-foreground mb-10 max-w-lg"
  >
    With a strong commitment to quality control and sustainability, we make bulk buying
    simple, reliable, and efficient.
  </motion.p>

  <motion.button
    variants={itemVariants}
    className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold shadow-lg hover:scale-105 transition"
  >
    Learn More
  </motion.button>
</motion.div>

  </div>
</section>
     
      <section className="min-h-screen flex items-center">
        <div className="container mx-auto  grid md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.h1
    variants={itemVariants}
    className="text-4xl md:text-6xl font-extrabold mb-6"
  >
    ONLINE <br /> Fruits & Vegetables STORE
  </motion.h1>

  <motion.p
    variants={itemVariants}
    className="text-muted-foreground mb-4 max-w-lg"
  >
    Fresh fruits and vegetables supplied in bulk, sourced directly from trusted farms.
  Built for businesses that need quality, quantity, and consistency.
  </motion.p>

  <motion.p
    variants={itemVariants}
    className="text-muted-foreground mb-8 max-w-lg"
  >
     Ideal for wholesalers, retailers, hotels, and catering services with competitive
  pricing, hygienic handling, and reliable doorstep delivery.
  </motion.p>

  <motion.button
    variants={itemVariants}
    className="px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold shadow-lg hover:scale-105 transition"
  >
    Order Now
  </motion.button>
</motion.div>

          {/* RIGHT IMAGE (ROTATING + SLIDE IN) */}
          <motion.div
            initial={{ opacity: 0, x: 150, rotate: 100 }}
            whileInView={{ opacity: 1, x: 0, rotate: 25 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 14,
            }}
            className="flex justify-center"
          >
            <img
              src={fruits}
              alt="Fruit Plate"
              className="w-[320px] md:w-[420px] drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

     <section className="w-full bg-green-600 overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap py-4"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 18,
          ease: "linear",
        }}
      >
        {/* Repeated text for seamless loop */}
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Fresh Fruits in Bulk
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Farm Fresh Vegetables
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Wholesale Supply
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Direct From Farms
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Reliable Bulk Delivery
        </span>

        {/* Duplicate for smooth infinite scroll */}
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Fresh Fruits in Bulk
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Farm Fresh Vegetables
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Wholesale Supply
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Direct From Farms
        </span>
        <span className="mx-8 text-white text-lg md:text-xl font-semibold">
          Reliable Bulk Delivery
        </span>
      </motion.div>
    </section>

    </main>
  );
};

export default LandingPromo;

{/* ================= PARALLAX IMAGE SECTION ================= */}
    //   <section
    //     ref={parallaxRef}
    //     className="relative h-[70vh] overflow-hidden rounded-t-[3rem]"
    //   >
    //     <motion.img
    //       src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZhcm1zfGVufDB8fDB8fHww"
    //       alt="Get Fresh Fruits Today"
    //       style={{ y }}
    //       className="absolute inset-0 w-full h-full object-cover"
    //     />

    //     {/* Overlay content */}
    //     <div className="relative z-10 h-full flex items-center justify-end px-8 md:px-20">
    //       <motion.h2
    //         initial={{ opacity: 0, x: 60 }}
    //         whileInView={{ opacity: 1, x: 0 }}
    //         viewport={{ once: true }}
    //         transition={{ duration: 0.6 }}
    //         className="text-3xl md:text-5xl font-extrabold text-black text-right"
    //       >
    //         GET FRESH <br /> FRUITS TODAY
    //       </motion.h2>
    //     </div>
    //   </section>