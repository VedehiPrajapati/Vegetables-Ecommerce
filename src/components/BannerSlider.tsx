
// import { useState, useEffect, useRef } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Activity,
//   TrendingDown,
//   Truck,
//   ShieldCheck,
//   Wheat,
//   Zap,
//   Apple,
//   Coins,
//   Leaf,
//   BadgeCheck,
// } from "lucide-react";
// import banner5 from "@/assets/banner5.png";
// import banner2 from "@/assets/banner2.jpg";
// import banner4 from "@/assets/banner4.png";

// const slides = [
//   {
//     image: banner5,
//     badge: "B2B Wholesale Platform",
//     title: ["Farm-Fresh Produce.", "Direct to your Business."],
//     highlight: 1,
//     subtitle:
//       "Transparent daily pricing, stringent quality checks, and reliable next-day delivery for restaurants, hotels, and retailers.",
//     stats: [
//       { Icon: Wheat, value: "200+", label: "Verified farmers" },
//       { Icon: Zap, value: "Next-day", label: "Guaranteed delivery" },
//     ],
//   },
//   {
//     image: banner2,
//     badge: "Fresh Arrivals",
//     title: ["Seasonal Fruits.", "Fresh & Affordable."],
//     highlight: 1,
//     subtitle:
//       "Premium quality fruits sourced directly from trusted farmers at the best mandi prices — no middlemen.",
//     stats: [
//       { Icon: Apple, value: "50+", label: "Fruit varieties" },
//       { Icon: Coins, value: "Daily", label: "Mandi rate updates" },
//     ],
//   },
//   {
//     image: banner4,
//     badge: "Organic Collection",
//     title: ["Organic Greens.", "Healthy & Natural."],
//     highlight: 1,
//     subtitle:
//       "100% organic greens delivered fresh every morning. Zero pesticides, certified quality, consistent supply.",
//     stats: [
//       { Icon: Leaf, value: "100%", label: "Certified organic" },
//       { Icon: BadgeCheck, value: "Grade A", label: "Quality assured" },
//     ],
//   },
// ];

// const features = [
//   {
//     Icon: TrendingDown,
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     title: "Dynamic Bulk Pricing",
//     sub: "Updated daily based on mandi rates",
//   },
//   {
//     Icon: Truck,
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     title: "Next-Day Delivery",
//     sub: "Guaranteed morning slots for B2B",
//   },
//   {
//     Icon: ShieldCheck,
//     iconBg: "bg-green-100",
//     iconColor: "text-green-600",
//     title: "Grade-A Quality",
//     sub: "Strict sorting & grading process",
//   },
// ];

// const INTERVAL = 5000;
// const FEATURE_BAR_HEIGHT = 76;
// const FEATURE_BAR_OVERLAP = 38;

// const BannerSlider = () => {
//   const [current, setCurrent] = useState(0);
//   const timerRef = useRef(null);
//   const progressRef = useRef(null);
//   const startTimeRef = useRef(null);
//   const touchStartX = useRef(null);
//   const touchStartY = useRef(null);

//   const animateProgress = () => {
//     cancelAnimationFrame(progressRef.current);
//     startTimeRef.current = performance.now();
//     const step = (now) => {
//       const pct = Math.min(((now - startTimeRef.current) / INTERVAL) * 100, 100);
//       if (pct < 100) progressRef.current = requestAnimationFrame(step);
//     };
//     progressRef.current = requestAnimationFrame(step);
//   };

//   const startTimer = () => {
//     clearInterval(timerRef.current);
//     animateProgress();
//     timerRef.current = setInterval(() => {
//       setCurrent((p) => (p + 1) % slides.length);
//       animateProgress();
//     }, INTERVAL);
//   };

//   useEffect(() => {
//     startTimer();
//     return () => {
//       clearInterval(timerRef.current);
//       cancelAnimationFrame(progressRef.current);
//     };
//   }, []);

//   const go = (dir) => {
//     setCurrent((p) => (p + dir + slides.length) % slides.length);
//     startTimer();
//   };

//   const goTo = (i) => {
//     setCurrent(i);
//     startTimer();
//   };

//   // Swipe support
//   const handleTouchStart = (e) => {
//     touchStartX.current = e.touches[0].clientX;
//     touchStartY.current = e.touches[0].clientY;
//   };

//   const handleTouchEnd = (e) => {
//     if (touchStartX.current === null) return;
//     const dx = e.changedTouches[0].clientX - touchStartX.current;
//     const dy = e.changedTouches[0].clientY - touchStartY.current;
//     if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
//       go(dx < 0 ? 1 : -1);
//     }
//     touchStartX.current = null;
//     touchStartY.current = null;
//   };

//   return (
//     <div
//       className="relative w-full"
//       style={{ paddingBottom: `${FEATURE_BAR_OVERLAP}px` }}
//     >
//       {/* ── BANNER ── */}
//       <div
//         className="relative w-full h-[380px] xs:h-[400px] sm:h-[460px] md:h-[520px] overflow-hidden rounded-b-[28px] bg-[#0a1a0f]"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* SLIDING TRACK */}
//         <div
//           className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]"
//           style={{ transform: `translateX(-${current * 100}%)` }}
//         >
//           {slides.map((slide, i) => (
//             <div key={i} className="relative min-w-full h-full flex-shrink-0">
//               <img
//                 src={slide.image}
//                 alt={`slide-${i}`}
//                 className="w-full h-full object-cover object-center"
//               />

//               {/* GRADIENT — slightly stronger on mobile for readability */}
//               <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.68)_50%,rgba(0,0,0,0.28)_100%)] sm:bg-[linear-gradient(105deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.65)_50%,rgba(0,0,0,0.25)_100%)]" />

//               {/* CONTENT */}
//               <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5 sm:items-start sm:text-left sm:px-10 md:px-14 pb-16 sm:pb-12">

//                 {/* BADGE */}
//                 <div className="inline-flex items-center gap-2 bg-green-400/15 border border-green-400/35 text-green-400 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase px-3 py-[5px] rounded-full w-fit mb-3 sm:mb-4">
//                   <span className="w-[6px] h-[6px] rounded-full bg-green-400 animate-pulse" />
//                   {slide.badge}
//                 </div>

//                 {/* TITLE */}
//                 <h1 className="text-[22px] xs:text-[26px] sm:text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-[260px] xs:max-w-[290px] sm:max-w-sm md:max-w-xl mb-2 sm:mb-3">
//                   {slide.title.map((line, j) => (
//                     <span
//                       key={j}
//                       className={`block ${j === slide.highlight ? "text-green-400" : ""}`}
//                     >
//                       {line}
//                     </span>
//                   ))}
//                 </h1>

//                 {/* SUBTITLE */}
//                 <p className="text-[11px] xs:text-xs sm:text-sm text-white/70 max-w-[240px] xs:max-w-[270px] sm:max-w-sm md:max-w-md leading-relaxed mb-5 sm:mb-6">
//                   {slide.subtitle}
//                 </p>

//                 {/* BUTTONS */}
//                 <div className="flex flex-row gap-2 sm:gap-3 w-full justify-center sm:justify-start sm:w-auto">
//                   <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all hover:-translate-y-px active:scale-95">
//                     <Activity size={13} />
//                     View Market Rates
//                   </button>
//                   <button className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:-translate-y-px active:scale-95">
//                     Order Now
//                   </button>
//                 </div>

//                 {/* STAT CHIPS — visible on mobile as small row, hidden on md (shown on right side instead) */}
//                 <div className="flex gap-2 mt-4 md:hidden">
//                   {slide.stats.map((s, j) => (
//                     <div
//                       key={j}
//                       className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm rounded-xl px-3 py-2"
//                     >
//                       <div className="w-6 h-6 rounded-lg bg-green-400/20 flex items-center justify-center flex-shrink-0">
//                         <s.Icon size={12} className="text-green-400" strokeWidth={1.8} />
//                       </div>
//                       <div>
//                         <div className="text-sm font-extrabold text-white leading-none">{s.value}</div>
//                         <div className="text-[9px] text-white/60 mt-0.5">{s.label}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* STAT CHIPS — desktop only right column */}
//               <div className="absolute right-8 top-1/2 -translate-y-[60%] hidden md:flex flex-col gap-3">
//                 {slide.stats.map((s, j) => (
//                   <div
//                     key={j}
//                     className="flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur-md rounded-[14px] px-4 py-3 min-w-[170px]"
//                   >
//                     <div className="w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center flex-shrink-0">
//                       <s.Icon size={18} className="text-green-400" strokeWidth={1.8} />
//                     </div>
//                     <div>
//                       <div className="text-xl font-extrabold text-white leading-none">{s.value}</div>
//                       <div className="text-[11px] text-white/60 mt-0.5">{s.label}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* NAV BUTTONS — hidden on mobile (swipe instead), visible sm+ */}
//         <button
//           onClick={() => go(-1)}
//           className="absolute left-3 top-[calc(50%-44px)] -translate-y-1/2 hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow transition-all hover:scale-110 z-20"
//         >
//           <ChevronLeft size={16} color="#222" strokeWidth={2.5} />
//         </button>
//         <button
//           onClick={() => go(1)}
//           className="absolute right-3 top-[calc(50%-44px)] -translate-y-1/2 hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow transition-all hover:scale-110 z-20"
//         >
//           <ChevronRight size={16} color="#222" strokeWidth={2.5} />
//         </button>

//         {/* DOT INDICATORS */}
//         <div className="absolute bottom-14 left-0 right-0 flex justify-center sm:justify-start sm:left-10 md:left-14 gap-2 items-center z-20 sm:right-auto">
//           {slides.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => goTo(i)}
//               className={`h-1 rounded-full border-none cursor-pointer transition-all duration-300 ${
//                 i === current ? "w-7 bg-green-400" : "w-2 bg-white/40"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ── FEATURE BAR — straddles banner bottom edge ── */}
//       <div
//         className="absolute left-0 right-0 flex justify-center px-3 sm:px-6 z-30"
//         style={{ bottom: 0 }}
//       >
//         <div
//           className="w-full max-w-4xl bg-white rounded-[20px] grid grid-cols-3 overflow-hidden"
//           style={{
//             boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.10)",
//           }}
//         >
//           {features.map((f, i) => (
//             <div
//               key={i}
//               className={`group flex items-center gap-2 sm:gap-3 px-2 xs:px-3 sm:px-5 py-3 sm:py-4 relative transition-colors hover:bg-green-50 cursor-default ${
//                 i < features.length - 1 ? "border-r border-gray-100" : ""
//               }`}
//             >
//               {/* HOVER UNDERLINE */}
//               <div className="absolute bottom-0 left-2 right-2 xs:left-3 xs:right-3 sm:left-5 sm:right-5 h-[2px] bg-green-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

//               {/* ICON — hidden on mobile, visible sm+ */}
//               <div
//                 className={`hidden sm:flex w-9 h-9 md:w-[46px] md:h-[46px] rounded-[12px] md:rounded-[14px] items-center justify-center flex-shrink-0 ${f.iconBg}`}
//               >
//                 <f.Icon size={18} className={f.iconColor} strokeWidth={1.8} />
//               </div>

//               {/* ICON — mobile only, smaller */}
//               <div
//                 className={`flex sm:hidden w-7 h-7 rounded-[10px] items-center justify-center flex-shrink-0 ${f.iconBg}`}
//               >
//                 <f.Icon size={14} className={f.iconColor} strokeWidth={1.8} />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-[9px] xs:text-[10px] sm:text-[12px] md:text-[13px] font-bold text-gray-900 leading-tight">
//                   {f.title}
//                 </p>
//                 <p className=" xs:block text-[8px] sm:text-[10px] md:text-[11px] text-gray-500 mt-0.5 leading-tight">
//                   {f.sub}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BannerSlider;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Activity,
  TrendingDown,
  Truck,
  ShieldCheck,
  Wheat,
  Zap,
  Apple,
  Coins,
  Leaf,
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";
import banner5 from "@/assets/banner5.png";
import banner2 from "@/assets/banner2.jpg";
import banner4 from "@/assets/banner4.png";

const slides = [
  {
    image: banner5,
    badge: "B2B Wholesale Platform",
    title: ["Farm-Fresh Produce.", "Direct to your Business."],
    highlight: 1,
    subtitle:
      "Transparent daily pricing, stringent quality checks, and reliable next-day delivery ",
    stats: [
      { Icon: Wheat, value: "200+", label: "Verified farmers" },
      { Icon: Zap, value: "Next-day", label: "Guaranteed delivery" },
    ],
  },
  {
    image: banner2,
    badge: "Fresh Arrivals",
    title: ["Seasonal Fruits.", "Fresh & Affordable."],
    highlight: 1,
    subtitle:
      "Premium quality fruits sourced directly from trusted farmers at the best mandi prices — no middlemen.",
    stats: [
      { Icon: Apple, value: "50+", label: "Fruit varieties" },
      { Icon: Coins, value: "Daily", label: "Mandi rate updates" },
    ],
  },
  {
  image: banner4,
  badge: "Wholesale Simplified",
  title: ["Primary Markets.", "At Your Doorstep."],
  highlight: 1, 
  subtitle:
    "Skip the early morning logistics and heavy lifting. We source directly from the largest wholesale hubs to provide sorted, graded produce delivered straight to your business.",
  stats: [
    { Icon: ShoppingCart, value: "Bulk", label: "Wholesale Rates" },
    { Icon: Truck, value: "Zero Hassle", label: "Direct Delivery" },
  ],
},
];

const features = [
  {
    Icon: TrendingDown,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Dynamic Bulk Pricing",
    sub: "Updated daily based on mandi rates",
  },
  {
    Icon: Truck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Next-Day Delivery",
    sub: "Guaranteed morning slots for B2B",
  },
  {
    Icon: ShieldCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Grade-A Quality",
    sub: "Strict sorting & grading process",
  },
];

const INTERVAL = 5000;
const FEATURE_BAR_OVERLAP = 38;

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const startTimeRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const navigate = useNavigate();

  const animateProgress = () => {
    cancelAnimationFrame(progressRef.current);
    startTimeRef.current = performance.now();
    const step = (now) => {
      const pct = Math.min(((now - startTimeRef.current) / INTERVAL) * 100, 100);
      if (pct < 100) progressRef.current = requestAnimationFrame(step);
    };
    progressRef.current = requestAnimationFrame(step);
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    animateProgress();
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
      animateProgress();
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, []);

  const go = (dir) => {
    setCurrent((p) => (p + dir + slides.length) % slides.length);
    startTimer();
  };

  const goTo = (i) => {
    setCurrent(i);
    startTimer();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      className="relative w-full"
      style={{ paddingBottom: `${FEATURE_BAR_OVERLAP}px` }}
    >
      {/* ── BANNER ── */}
      <div
        className="relative w-full h-[380px] xs:h-[400px] sm:h-[460px] md:h-[520px] overflow-hidden rounded-b-[28px] bg-[#0a1a0f]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* SLIDING TRACK */}
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative min-w-full h-full flex-shrink-0">
              <img
                src={slide.image}
                alt={`slide-${i}`}
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.68)_50%,rgba(0,0,0,0.28)_100%)] sm:bg-[linear-gradient(105deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.65)_50%,rgba(0,0,0,0.25)_100%)]" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5 sm:items-start sm:text-left sm:px-10 md:px-14 pb-16 sm:pb-12">

                {/* BADGE */}
                <div className="inline-flex items-center gap-2 bg-green-400/15 border border-green-400/35 text-green-400 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase px-3 py-[5px] rounded-full w-fit mb-3 sm:mb-4">
                  <span className="w-[6px] h-[6px] rounded-full bg-green-400 animate-pulse" />
                  {slide.badge}
                </div>

                {/* TITLE */}
                <h1 className="text-[22px] xs:text-[26px] sm:text-3xl md:text-5xl font-extrabold text-white leading-tight max-w-[260px] xs:max-w-[290px] sm:max-w-sm md:max-w-xl mb-2 sm:mb-3">
                  {slide.title.map((line, j) => (
                    <span
                      key={j}
                      className={`block ${j === slide.highlight ? "text-green-400" : ""}`}
                    >
                      {line}
                    </span>
                  ))}
                </h1>

                {/* SUBTITLE */}
                <p className="text-[11px] xs:text-xs sm:text-sm text-white/70 max-w-[240px] xs:max-w-[270px] sm:max-w-sm md:max-w-md leading-relaxed mb-5 sm:mb-6">
                  {slide.subtitle}
                </p>

                {/* BUTTONS */}
                <div className="flex flex-row gap-2 sm:gap-3 w-full justify-center sm:justify-start sm:w-auto">
                  <button
                    onClick={() => navigate("/products")}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all hover:-translate-y-px active:scale-95"
                  >
                    <Activity size={13} />
                    View Market Rates
                  </button>
                  <button
                    onClick={() => navigate("/products")}
                    className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/30 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:-translate-y-px active:scale-95"
                  >
                    Order Now
                  </button>
                </div>

                {/* STAT CHIPS — mobile */}
                <div className="flex gap-2 mt-4 md:hidden">
                  {slide.stats.map((s, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm rounded-xl px-3 py-2"
                    >
                      <div className="w-6 h-6 rounded-lg bg-green-400/20 flex items-center justify-center flex-shrink-0">
                        <s.Icon size={12} className="text-green-400" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-white leading-none">{s.value}</div>
                        <div className="text-[9px] text-white/60 mt-0.5">{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAT CHIPS — desktop */}
              <div className="absolute right-8 top-1/2 -translate-y-[60%] hidden md:flex flex-col gap-3">
                {slide.stats.map((s, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 bg-white/10 border border-white/15 backdrop-blur-md rounded-[14px] px-4 py-3 min-w-[170px]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center flex-shrink-0">
                      <s.Icon size={18} className="text-green-400" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-white leading-none">{s.value}</div>
                      <div className="text-[11px] text-white/60 mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* NAV BUTTONS */}
        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-[calc(50%-44px)] -translate-y-1/2 hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow transition-all hover:scale-110 z-20"
        >
          <ChevronLeft size={16} color="#222" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-[calc(50%-44px)] -translate-y-1/2 hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow transition-all hover:scale-110 z-20"
        >
          <ChevronRight size={16} color="#222" strokeWidth={2.5} />
        </button>

        {/* DOT INDICATORS */}
        <div className="absolute bottom-14 left-0 right-0 flex justify-center sm:justify-start sm:left-10 md:left-14 gap-2 items-center z-20 sm:right-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full border-none cursor-pointer transition-all duration-300 ${
                i === current ? "w-7 bg-green-400" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── FEATURE BAR ── */}
      <div
        className="absolute left-0 right-0 flex justify-center px-3 sm:px-6 z-30"
        style={{ bottom: 0 }}
      >
        <div
          className="w-full max-w-4xl bg-white rounded-[20px] grid grid-cols-3 overflow-hidden"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.10)",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              onClick={() => navigate("/products")}
              className={`group flex items-center gap-2 sm:gap-3 px-2 xs:px-3 sm:px-5 py-3 sm:py-4 relative transition-colors hover:bg-green-50 cursor-pointer ${
                i < features.length - 1 ? "border-r border-gray-100" : ""
              }`}
            >
              {/* HOVER UNDERLINE */}
              <div className="absolute bottom-0 left-2 right-2 xs:left-3 xs:right-3 sm:left-5 sm:right-5 h-[2px] bg-green-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

              {/* ICON — sm+ */}
              <div
                className={`hidden sm:flex w-9 h-9 md:w-[46px] md:h-[46px] rounded-[12px] md:rounded-[14px] items-center justify-center flex-shrink-0 ${f.iconBg}`}
              >
                <f.Icon size={18} className={f.iconColor} strokeWidth={1.8} />
              </div>

              {/* ICON — mobile */}
              <div
                className={`flex sm:hidden w-7 h-7 rounded-[10px] items-center justify-center flex-shrink-0 ${f.iconBg}`}
              >
                <f.Icon size={14} className={f.iconColor} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] xs:text-[10px] sm:text-[12px] md:text-[13px] font-bold text-gray-900 leading-tight">
                  {f.title}
                </p>
                <p className="xs:block text-[8px] sm:text-[10px] md:text-[11px] text-gray-500 mt-0.5 leading-tight">
                  {f.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;