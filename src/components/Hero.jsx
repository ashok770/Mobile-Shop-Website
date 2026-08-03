import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck, RotateCcw, Zap } from "lucide-react";

/* ── local image imports ── */
import iphone  from "../assets/images/iphone.png";
import samsung from "../assets/images/samsung.png";
import nothing from "../assets/images/nothing.png";
import oneplus from "../assets/images/oneplus.png";
import realme  from "../assets/images/realme.jpeg";

export const heroImages = [iphone, samsung, nothing, oneplus, realme];

/* ── animation variants — unchanged ── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1], delay } },
});

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.55, ease: "easeOut", delay } },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } },
});

/* ── static data — unchanged ── */
const TRUST = [
  { icon: <Star        size={14} className="fill-amber-400 text-amber-400" />, label: "4.9/5 Rating"  },
  { icon: <ShieldCheck size={14} className="text-emerald-500" />,              label: "100% Genuine"  },
  { icon: <Truck       size={14} className="text-blue-500" />,                 label: "Free Delivery" },
  { icon: <RotateCcw   size={14} className="text-violet-500" />,               label: "Easy Returns"  },
];

const BRANDS = [
  { name: "Apple",    cls: "font-black tracking-tight"                    },
  { name: "Samsung",  cls: "font-bold tracking-tight"                     },
  { name: "Google",   cls: "font-bold"                                    },
  { name: "OnePlus",  cls: "font-bold tracking-wide"                      },
  { name: "Nothing",  cls: "font-black tracking-widest uppercase text-xs" },
  { name: "Xiaomi",   cls: "font-bold"                                    },
  { name: "Motorola", cls: "font-semibold"                                },
];

/* P1+P5: Clear size hierarchy — Nothing dominates, Samsung/iPhone recede */
const PHONES = [
  {
    src: samsung, alt: "Samsung Galaxy",
    style: {
      position: "absolute",
      width: "55%",        /* P4: was 52% */
      top: "45%",          /* P4: anchored at mid-height, not bottom */
      left: "12%",         /* P4: inset from edge */
      zIndex: 1,
      transform: "rotate(-6deg)",  /* P4 */
      filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.18))",  /* P10 */
      opacity: 0.65,       /* P4: clearly subordinate */
    },
    animate: { y: [0, -10, 0] },
    transition: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
  },
  {
    src: nothing, alt: "Nothing Phone",
    style: {
      position: "absolute",
      width: "68%",        /* P3+P5: dominant hero phone, ~430px equivalent */
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 3,
      filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.18))",  /* P10: clean shadow */
    },
    animate: { y: [0, -14, 0] },
    transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
  },
  {
    src: iphone, alt: "Apple iPhone",
    style: {
      position: "absolute",
      width: "48%",        /* P5 */
      top: "45%",          /* P5: mirrors Samsung */
      right: "10%",        /* P5: inset from edge */
      zIndex: 2,
      transform: "rotate(6deg)",   /* P5 */
      filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.18))",  /* P10 */
      opacity: 0.75,       /* P5 */
    },
    animate: { y: [0, -8, 0] },
    transition: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
  },
];

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:   "linear-gradient(135deg, #eef2ff 0%, #f8fafc 45%, #fff4ed 100%)",
        borderBottom: "1px solid rgba(203,213,225,0.45)",
        boxShadow:    "0 4px 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── ambient blobs ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* P3: keep only left-blue and right-orange blobs, remove center blob */}
        <div
          className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, #bfdbfe 0%, transparent 68%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #fed7aa 0%, transparent 68%)" }}
        />
      </div>

      {/* P1: py-14 lg:py-18 — tighter vertical padding for premium feel */}
      <div className="relative max-w-[1320px] mx-auto px-5 lg:px-8 py-14 lg:py-18">
        {/* P1: equal 1fr/1fr columns — removes the lopsided 45/55 imbalance */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 items-center">

          {/* ════ LEFT — text content — unchanged ════ */}
          <div className="flex flex-col gap-5 order-2 lg:order-1 lg:pr-4">

            <motion.div variants={fadeUp(0)} initial="hidden" animate="show">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold"
                style={{
                  background: "linear-gradient(135deg,#fff7ed,#fef3c7)",
                  border:     "1px solid #fde68a",
                  color:      "#92400e",
                  boxShadow:  "0 2px 12px rgba(251,191,36,0.18)",
                }}
              >
                <Zap size={13} className="fill-amber-400 text-amber-400" />
                🔥 New Launch 2026 — Limited Stock
              </span>
            </motion.div>

            <motion.div variants={fadeUp(0.08)} initial="hidden" animate="show">
              <h1 className="text-[38px] sm:text-[48px] lg:text-[54px] font-black leading-[1.1] tracking-tight text-slate-900">
                Experience the{" "}
                <span className="relative inline-block">
                  <span
                    style={{
                      background:           "linear-gradient(135deg,#2563eb,#7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor:  "transparent",
                      backgroundClip:       "text",
                    }}
                  >
                    Future
                  </span>
                  <svg
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 w-full"
                    height="6"
                    viewBox="0 0 200 6"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 5 Q50 0 100 5 Q150 10 200 5"
                      stroke="url(#ug)"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="ug" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2563eb" />
                        <stop offset="1" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                in Your Hands.
              </h1>
            </motion.div>

            <motion.p
              variants={fadeUp(0.16)}
              initial="hidden"
              animate="show"
              className="text-[16px] sm:text-[17px] text-slate-500 leading-[1.75] max-w-[500px]"
            >
              Shop the latest flagship smartphones — Apple, Samsung, OnePlus &amp; more.
              100% genuine products, expert support, and lightning-fast delivery to your door.
            </motion.p>

            <motion.div
              variants={fadeUp(0.22)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3"
            >
              {TRUST.map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700"
                  style={{
                    background:     "rgba(255,255,255,0.85)",
                    border:         "1px solid rgba(226,232,240,0.9)",
                    boxShadow:      "0 2px 8px rgba(0,0,0,0.05)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {t.icon}
                  {t.label}
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(37,99,235,0.35)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/mobiles")}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-[15px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  boxShadow:  "0 6px 20px rgba(37,99,235,0.3)",
                }}
                aria-label="Shop Smartphones"
              >
                Shop Smartphones
                <ArrowRight size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, background: "rgba(37,99,235,0.06)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/mobiles")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[15px] font-semibold text-slate-700 transition-colors duration-200"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border:     "1.5px solid rgba(203,213,225,0.9)",
                  boxShadow:  "0 2px 8px rgba(0,0,0,0.06)",
                }}
                aria-label="View Today's Deals"
              >
                View Today's Deals
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeIn(0.42)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["2563eb", "7c3aed", "f97316", "10b981"].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: `#${c}` }}
                  >
                    {["A", "S", "R", "P"][i]}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-slate-500">
                <span className="font-semibold text-slate-800">12,000+</span> happy customers this month
              </p>
            </motion.div>
          </div>

          {/* ════ RIGHT — phone composition ════
              Outer wrapper: removed minHeight — the aspectRatio bounding box
              drives height naturally. py-4 gives a small breathing margin
              so floating badge shadows aren't clipped by the column edge.
          ════ */}
          <motion.div
            variants={scaleIn(0.1)}
            initial="hidden"
            animate="show"
            className="relative flex items-center justify-center order-1 lg:order-2 py-4"
          >
            {/* P4: tighter glow — 420px, opacity 0.18 */}
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                style={{
                  width: "420px", height: "420px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle,#2563eb 0%,transparent 70%)",
                  filter:     "blur(48px)",
                  opacity:    0.18,
                }}
              />
            </div>

            <div
              className="relative z-10"
              style={{ width: "min(430px, 90%)", aspectRatio: "1 / 1.2" }}
            >
              {PHONES.map((phone) => (
                <motion.img
                  key={phone.alt}
                  src={phone.src}
                  alt={phone.alt}
                  className="object-contain"
                  style={phone.style}
                  animate={phone.animate}
                  transition={phone.transition}
                  loading="eager"
                  draggable={false}
                />
              ))}

              {/* floating badge: reviews
                  top-[8%] -right-8 — was -top-6 -right-6.
                  Anchored alongside the upper body of the center phone,
                  not floating above empty air at the top of the bounding box.
              */}
              {/* P6: rating badge — top-8 right-2, closer to phone body */}
              <motion.div
                initial={{ opacity: 0, x: 16, y: -12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-8 right-2 px-3.5 py-2.5 rounded-2xl text-[12px] font-bold z-20"
                style={{
                  background:           "rgba(255,255,255,0.94)",
                  backdropFilter:       "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border:               "1px solid rgba(255,255,255,0.7)",
                  boxShadow:            "0 8px 28px rgba(0,0,0,0.10)",
                  color:                "#0f172a",
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-[13px]">★★★★★</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">4.9 · 2,400 reviews</div>
              </motion.div>

              {/* floating badge: delivery
                  bottom-[10%] -left-8 — was -bottom-6 -left-6.
                  Anchored alongside the lower body of the center phone,
                  stays within the visual boundary of the composition.
              */}
              {/* P6: delivery badge — bottom-8 left-4, closer to phone body */}
              <motion.div
                initial={{ opacity: 0, x: -16, y: 12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.75, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-8 left-4 px-3.5 py-2.5 rounded-2xl z-20"
                style={{
                  background:           "rgba(255,255,255,0.94)",
                  backdropFilter:       "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border:               "1px solid rgba(255,255,255,0.7)",
                  boxShadow:            "0 8px 28px rgba(0,0,0,0.10)",
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                  >
                    <Truck size={13} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-slate-800">Free Delivery</div>
                    <div className="text-[10px] text-slate-400 font-medium">Ships in 24 hrs</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ════ BRAND LOGOS STRIP — unchanged ════ */}
        <motion.div
          variants={fadeUp(0.45)}
          initial="hidden"
          animate="show"
          className="mt-12"
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 mb-5">
            Official Authorized Dealer
          </p>
          {/* P6: gap-x-8 brand logo spacing */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {BRANDS.map((brand, i) => (
              <motion.span
                key={brand.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                whileHover={{ scale: 1.08, opacity: 1 }}
                className={`text-[15px] text-slate-400 hover:text-slate-700 transition-all duration-200 cursor-default select-none ${brand.cls}`}
              >
                {brand.name}
              </motion.span>
            ))}
          </div>
          <div
            className="mt-8 h-px w-full"
            style={{ background: "linear-gradient(90deg,transparent,rgba(203,213,225,0.7),transparent)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
