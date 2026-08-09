import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingCart,
  CircleUser,
  Menu,
  X,
  ChevronDown,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Smartphone,
  Headphones,
  UserPlus,
  Wrench,
  Phone,
  Zap,
  Star,
  Tag,
} from "lucide-react";

/* ─── Cart count helper ─── */
function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCount(cart.reduce((s, i) => s + (i.quantity || 1), 0));
      } catch {
        setCount(0);
      }
    };
    read();
    window.addEventListener("storage", read);
    window.addEventListener("cartUpdated", read);
    return () => {
      window.removeEventListener("storage", read);
      window.removeEventListener("cartUpdated", read);
    };
  }, []);
  return count;
}

/* ─── Dropdown data ─── */
const NAV_ITEMS = [
  {
    label: "Categories",
    icon: <Smartphone size={14} />,
    dropdown: [
      {
        label: "Smartphones",
        icon: <Smartphone size={15} />,
        path: "/mobiles",
      },
      {
        label: "Accessories",
        icon: <Headphones size={15} />,
        path: "/accessories",
      },
      { label: "Services", icon: <Wrench size={15} />, path: "/services" },
      { label: "Contact", icon: <Phone size={15} />, path: "/contact" },
    ],
  },
  {
    label: "Brands",
    icon: <Star size={14} />,
    dropdown: [
      { label: "Apple", path: "/mobiles?brand=Apple" },
      { label: "Samsung", path: "/mobiles?brand=Samsung" },
      { label: "Redmi", path: "/mobiles?brand=Redmi" },
      { label: "OnePlus", path: "/mobiles?brand=OnePlus" },
    ],
  },
  {
    label: "Deals",
    icon: <Tag size={14} />,
    dropdown: [
      { label: "Flash Sale", path: "/offers/mega-flash" },
      { label: "Buy 1 Get 1", path: "/offers/bogo" },
      { label: "Under ₹1,000", path: "/offers/below-1000" },
      { label: "Daily Special", path: "/offers/daily" },
    ],
  },
  {
    label: "New Arrivals",
    icon: <Zap size={14} />,
    path: "/mobiles",
  },
];

/* ─── Dropdown Menu ─── */
function DropdownMenu({ items }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-full left-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
      }}
    >
      <div className="p-1.5">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
          >
            {item.icon && (
              <span className="text-slate-400 group-hover:text-blue-500 transition-colors duration-200">
                {item.icon}
              </span>
            )}
            {item.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Nav Item with optional dropdown ─── */
function NavItem({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const isActive = item.path
    ? location.pathname === item.path
    : item.dropdown?.some(
        (sub) => location.pathname === sub.path.split("?")[0],
      );
  const linkClassName = `flex items-center gap-1.5 px-1 py-1 text-[16px] font-semibold tracking-normal transition-colors duration-[250ms] relative group ${
    isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
  }`;
  const underlineClassName = `absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-[250ms] ${
    isActive ? "w-3/4" : "w-0 group-hover:w-full"
  }`;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.dropdown) {
    return (
      <Link to={item.path} className={linkClassName}>
        {item.label}
        <span className={underlineClassName} />
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className={linkClassName}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {item.label}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
        <span className={underlineClassName} />
      </button>
      <AnimatePresence>
        {open && <DropdownMenu items={item.dropdown} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Header ─── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const cartCount = useCartCount();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!accountMenuOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!accountMenuRef.current?.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [accountMenuOpen]);

  /* close mobile menu on resize */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/mobiles?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
    }
  };

  const navigateFromAccountMenu = (path) => {
    setAccountMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-[250ms]"
        animate={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        style={{
          background: "rgba(255,255,255,0.95)",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
          boxShadow: scrolled
            ? "0 8px 24px rgba(15,23,42,0.08)"
            : "0 4px 20px rgba(15,23,42,0.05)",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6 h-[74px]">
            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label="Ommasta Home"
            >
              <div className="w-[39px] h-[39px] rounded-xl overflow-hidden border border-white/40 shadow-sm">
                <img
                  src="/images/logo.png"
                  alt="Ommasta"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center hidden"
                  aria-hidden="true"
                >
                  <span className="text-white font-black text-lg">O</span>
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[17px] font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                  Om
                  <span className="text-blue-600 group-hover:text-orange-500 transition-colors duration-200">
                    masta
                  </span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                  Mobile Shop
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav
              className="hidden lg:flex items-center gap-6 ml-2"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </nav>

            {/* ── Search Bar ── */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-[420px] mx-auto lg:mx-0 relative"
            >
              <motion.div
                animate={{
                  boxShadow: searchFocused
                    ? "0 0 0 3px rgba(37,99,235,0.15), 0 4px 20px rgba(37,99,235,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  scale: 1,
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center w-full h-[46px] rounded-full border transition-colors duration-[250ms]"
                style={{
                  background: "#ffffff",
                  borderColor: searchFocused
                    ? "rgba(37,99,235,0.55)"
                    : "#e2e8f0",
                }}
              >
                <Search
                  size={16}
                  className="ml-4 shrink-0 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search smartphones, accessories..."
                  aria-label="Search products"
                  className="flex-1 h-full bg-transparent px-3 text-[14px] text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </motion.div>
            </form>

            {/* ── Right Icons ── */}
            <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
              {/* Mobile search icon */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="md:hidden flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-[250ms]"
                aria-label="Search"
                onClick={() => navigate("/mobiles")}
              >
                <Search size={20} />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="hidden sm:flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-[250ms]"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-[250ms]"
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
                      style={{
                        background: "linear-gradient(135deg,#f97316,#ef4444)",
                      }}
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Account menu */}
              <div ref={accountMenuRef} className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  disabled={loading}
                  className="flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-[250ms] disabled:cursor-wait disabled:opacity-60"
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                >
                  <CircleUser size={20} />
                </motion.button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-3 w-[272px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-2.5 shadow-[0_22px_56px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.025] backdrop-blur-2xl"
                    >
                      {user ? (
                        <>
                          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/70 px-3.5 py-3">
                            <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-slate-900">
                              {user.name || "My Account"}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">{user.email}</p>
                          </div>
                          <div className="mx-1 my-2 h-px bg-slate-200/80" />
                          <button onClick={() => navigateFromAccountMenu("/profile")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <CircleUser size={17} strokeWidth={1.9} /> My Profile
                          </button>
                          <button onClick={() => navigateFromAccountMenu("/orders")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <Package size={17} strokeWidth={1.9} /> My Orders
                          </button>
                          <button onClick={() => navigateFromAccountMenu("/addresses")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <MapPin size={17} strokeWidth={1.9} /> Saved Addresses
                          </button>
                          <button onClick={() => navigateFromAccountMenu("/wishlist")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <Heart size={17} strokeWidth={1.9} /> Wishlist
                          </button>
                          <div className="mx-1 my-2 h-px bg-slate-200/80" />
                          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50 hover:shadow-sm">
                            <LogOut size={17} strokeWidth={1.9} /> Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/70 px-3.5 py-3">
                            <p className="text-[13px] font-bold tracking-[-0.01em] text-slate-900">Welcome to Ommasta</p>
                            <p className="mt-0.5 text-[11px] font-medium text-slate-500">Sign in for a faster checkout.</p>
                          </div>
                          <div className="mx-1 my-2 h-px bg-slate-200/80" />
                          <button onClick={() => navigateFromAccountMenu("/login")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <LogIn size={17} strokeWidth={1.9} /> Login
                          </button>
                          <button onClick={() => navigateFromAccountMenu("/register")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm">
                            <UserPlus size={17} strokeWidth={1.9} /> Create Account
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-[250ms]"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <X size={20} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                    >
                      <Menu size={20} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20"
              style={{ backdropFilter: "blur(4px)" }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] flex flex-col"
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                borderLeft: "1px solid rgba(255,255,255,0.4)",
                boxShadow: "-20px 0 60px rgba(0,0,0,0.12)",
              }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span className="text-[16px] font-bold text-slate-900">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile search */}
              <div className="px-4 py-3 border-b border-slate-100">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5"
                >
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="search"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-[14px] text-slate-800 placeholder-slate-400 outline-none"
                  />
                </form>
              </div>

              {/* Nav links */}
              <nav
                className="flex-1 overflow-y-auto px-3 py-3"
                aria-label="Mobile navigation"
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.22 }}
                  >
                    {item.path && !item.dropdown ? (
                      <Link
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span className="text-slate-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 px-3 py-2 text-[12px] font-semibold uppercase tracking-widest text-slate-400 mt-2">
                          <span>{item.icon}</span>
                          {item.label}
                        </div>
                        {item.dropdown?.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-[14px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          >
                            {sub.icon && (
                              <span className="text-slate-400">{sub.icon}</span>
                            )}
                            {sub.label}
                          </Link>
                        ))}
                      </>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Panel footer */}
              <div className="px-4 py-4 border-t border-slate-100 space-y-1">
                {user ? (
                  <>
                    <button onClick={() => { navigate("/profile"); setMobileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <CircleUser size={18} /> My Account
                    </button>
                    <button onClick={() => { navigate("/orders"); setMobileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <Package size={18} /> Orders
                    </button>
                    <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-rose-600 hover:bg-rose-50 transition-colors duration-200">
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <LogIn size={18} /> Login
                    </button>
                    <button onClick={() => { navigate("/register"); setMobileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <UserPlus size={18} /> Register
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-[74px]" aria-hidden="true" />
    </>
  );
}

export default Header;
