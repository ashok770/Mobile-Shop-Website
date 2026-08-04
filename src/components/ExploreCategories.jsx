import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Apple,
  BatteryCharging,
  Headphones,
  Package,
  Plug2,
  Plus,
  Smartphone,
  Watch,
  Circle,
  Phone,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Samsung",
    path: "/mobiles?brand=Samsung",
    icon: <Smartphone size={26} />,
    subtitle: "320 Products",
    accent: "#1428a0",
    bg: "linear-gradient(135deg, #e8ecff 0%, #f0f3ff 100%)",
  },
  {
    id: 2,
    name: "Apple",
    path: "/mobiles?brand=Apple",
    icon: <Apple size={26} />,
    subtitle: "290 Products",
    accent: "#1d1d1f",
    bg: "linear-gradient(135deg, #f0f0f0 0%, #f8f8f8 100%)",
  },
  {
    id: 3,
    name: "OnePlus",
    path: "/mobiles?brand=OnePlus",
    icon: <Plus size={26} />,
    subtitle: "210 Products",
    accent: "#eb0029",
    bg: "linear-gradient(135deg, #fff0f2 0%, #fff5f6 100%)",
  },
  {
    id: 4,
    name: "Redmi",
    path: "/mobiles?brand=Redmi",
    icon: <Phone size={26} />,
    subtitle: "260 Products",
    accent: "#ff6900",
    bg: "linear-gradient(135deg, #fff3eb 0%, #fff7f2 100%)",
  },
  {
    id: 5,
    name: "Nothing",
    path: "/mobiles?brand=Nothing",
    icon: <Circle size={26} />,
    subtitle: "130 Products",
    accent: "#111111",
    bg: "linear-gradient(135deg, #f2f2f2 0%, #f9f9f9 100%)",
  },
  {
    id: 6,
    name: "Chargers",
    path: "/accessories?category=Chargers",
    icon: <Plug2 size={26} />,
    subtitle: "460 Products",
    accent: "#7c3aed",
    bg: "linear-gradient(135deg, #f3eeff 0%, #f7f3ff 100%)",
  },
  {
    id: 7,
    name: "Earbuds",
    path: "/accessories?category=Earbuds",
    icon: <Headphones size={26} />,
    subtitle: "290 Products",
    accent: "#0891b2",
    bg: "linear-gradient(135deg, #e0f7fa 0%, #f0fbfd 100%)",
  },
  {
    id: 8,
    name: "Smart Watches",
    path: "/accessories?category=Smart%20Watches",
    icon: <Watch size={26} />,
    subtitle: "230 Products",
    accent: "#059669",
    bg: "linear-gradient(135deg, #e6f7f2 0%, #f0faf6 100%)",
  },
  {
    id: 9,
    name: "Cases",
    path: "/accessories?category=Cases",
    icon: <Package size={26} />,
    subtitle: "180 Products",
    accent: "#d97706",
    bg: "linear-gradient(135deg, #fef3e2 0%, #fef8ee 100%)",
  },
  {
    id: 10,
    name: "Power Banks",
    path: "/accessories?category=Power%20Banks",
    icon: <BatteryCharging size={26} />,
    subtitle: "210 Products",
    accent: "#16a34a",
    bg: "linear-gradient(135deg, #e8f5e9 0%, #f1faf2 100%)",
  },
];

/* triple-clone for seamless loop — middle set is the "real" one */
const loopedCategories = [...categories, ...categories, ...categories];

/* card width + gap in px — must match CSS */
const CARD_W = 148;
const CARD_GAP = 14;
const STEP = CARD_W + CARD_GAP; /* one card scroll step */
const SPEED = 0.4;              /* px per rAF frame (~24px/s at 60fps) */

function ExploreCategories() {
  const navigate = useNavigate();
  const trackRef  = useRef(null);
  const animRef   = useRef(null);
  const posRef    = useRef(0);
  const pausedRef = useRef(false);  /* hover pause */
  const dragRef   = useRef({ active: false, startX: 0, startPos: 0 });
  const resumeTimerRef = useRef(null);

  /* ── rAF loop ── */
  const startLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = (STEP * categories.length); /* width of one set */

    const step = () => {
      if (!pausedRef.current && !dragRef.current.active) {
        posRef.current += SPEED;
        /* seamless reset: when we've scrolled one full set, jump back */
        if (posRef.current >= halfWidth * 2) {
          posRef.current -= halfWidth;
        }
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(step);
    };

    cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    /* start at the middle clone set so we can scroll both directions */
    const halfWidth = STEP * categories.length;
    posRef.current = halfWidth;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
    startLoop();
    return () => cancelAnimationFrame(animRef.current);
  }, [startLoop]);

  /* ── hover pause / resume ── */
  const onMouseEnter = () => { pausedRef.current = true; };
  const onMouseLeave = () => { pausedRef.current = false; };

  /* ── nav buttons ── */
  const scrollBy = (dir) => {
    pausedRef.current = true;
    const halfWidth = STEP * categories.length;
    posRef.current += dir * STEP;
    /* keep within the middle+last clone range */
    if (posRef.current < halfWidth) posRef.current += halfWidth;
    if (posRef.current >= halfWidth * 2) posRef.current -= halfWidth;
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 320ms ease";
      trackRef.current.style.transform  = `translateX(-${posRef.current}px)`;
      setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
        pausedRef.current = false;
      }, 340);
    }
  };

  /* ── drag ── */
  const onMouseDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current };
    if (trackRef.current) trackRef.current.style.cursor = "grabbing";
    clearTimeout(resumeTimerRef.current);
  };

  const onMouseMove = (e) => {
    if (!dragRef.current.active) return;
    const delta = dragRef.current.startX - e.clientX;
    const halfWidth = STEP * categories.length;
    let next = dragRef.current.startPos + delta;
    if (next < halfWidth) next += halfWidth;
    if (next >= halfWidth * 2) next -= halfWidth;
    posRef.current = next;
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
    }
  };

  const onMouseUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
    /* resume auto-scroll after 1.2s */
    resumeTimerRef.current = setTimeout(() => {
      if (trackRef.current) trackRef.current.style.cursor = "";
    }, 1200);
  };

  return (
    <section className="explore-categories">
      <div className="explore-categories__header">
        <h2>Explore Categories</h2>
        <p>Browse top mobile brands and accessories</p>
      </div>

      <div
        className="explore-categories__fade-wrap"
        onMouseEnter={onMouseEnter}
        onMouseLeave={(e) => { onMouseLeave(); onMouseUp(); }}
      >
        {/* nav buttons — visible on section hover via CSS */}
        <button
          type="button"
          className="explore-categories__nav explore-categories__nav--left"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="explore-categories__nav explore-categories__nav--right"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>

        <div className="explore-categories__track-outer">
          <div
            className="explore-categories__track"
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {loopedCategories.map((cat, i) => (
              <button
                key={`${cat.id}-${i}`}
                type="button"
                className="explore-category-card"
                onClick={() => !dragRef.current.active && navigate(cat.path)}
                style={{ "--cat-accent": cat.accent, "--cat-bg": cat.bg }}
                draggable={false}
              >
                <span
                  className="explore-category-card__icon"
                  style={{ color: cat.accent, background: cat.bg }}
                >
                  {cat.icon}
                </span>
                <h3 className="explore-category-card__name">{cat.name}</h3>
                <p className="explore-category-card__subtitle">{cat.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExploreCategories;
