import { useState, useEffect, useRef, useMemo } from "react";
import useAuth from "../hooks/useAuth";
import { useBrands } from "../context/BrandContext";
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
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
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
      <div className="p-1.5 max-h-[300px] overflow-y-auto">
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
  const underlineClassName = `absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-blue-500 transition-all duration-[250ms] ${
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
  const { user, logout, loading: authLoading } = useAuth();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();

  const navItems = useMemo(() => {
    const brandDropdown = brandsLoading
      ? [{ label: "Loading...", path: "#" }]
      : brandsError
      ? [{ label: "Error loading brands", path: "#" }]
      : brands && brands.length > 0
      ? brands.map((b) => ({ label: b.name, path: `/products?brand=${b.name}` }))
      : [{ label: "No brands found", path: "#" }];

    return [
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
        dropdown: brandDropdown,
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
  }, [brands, brandsLoading, brandsError]);

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
        style={{
          background: scrolled ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 1)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.05)"
            : "none",
        }}
      >
        <div className="max-w-[1320px] mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-6 h-[60px] md:h-[70px]">
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
                  OMMASTA
                </span>
                <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                  Mobile Shop
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav
              className="hidden lg:flex items-center gap-6 ml-2"
              aria-label="Main navigation"
            >
              {navItems.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </nav>

            {/* ── Search Bar ── */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-[540px] mx-auto lg:mx-8 relative"
            >
              <motion.div
                animate={{
                  boxShadow: searchFocused
                    ? "0 0 0 3px rgba(37,99,235,0.15), 0 4px 20px rgba(37,99,235,0.1)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  scale: 1,
                }}
                transition={{ duration: 0.25 }}
                className="flex items-center w-full h-[46px] rounded-full border transition-colors duration-[250ms]"
                style={{
                  background: searchFocused ? "#ffffff" : "#f1f5f9",
                  borderColor: searchFocused
                    ? "rgba(37,99,235,0.55)"
                    : "transparent",
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
            <div className="flex items-center gap-2 lg:gap-4 ml-auto lg:ml-0">
              {/* Mobile search icon */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="md:hidden flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors duration-[250ms]"
                aria-label="Search"
                onClick={() => navigate("/mobiles")}
              >
                <Search size={20} />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/profile/wishlist")}
                className="hidden sm:flex items-center gap-2 px-2 py-2 rounded-full text-slate-600 hover:text-blue-600 transition-colors duration-[250ms]"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                <span className="text-[14px] font-medium hidden xl:block">Wishlist</span>
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/cart")}
                className="relative flex items-center gap-2 px-2 py-2 rounded-full text-slate-600 hover:text-blue-600 transition-colors duration-[250ms]"
                aria-label={`Cart, ${cartCount} items`}
              >
                <div className="relative flex items-center justify-center">
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
                        className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
                        style={{
                          background: "linear-gradient(135deg,#f97316,#ef4444)",
                        }}
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-[14px] font-medium hidden xl:block">Cart</span>
              </motion.button>

              {/* Account menu */}
              <div ref={accountMenuRef} className="relative hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  disabled={authLoading}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200 border ${
                    accountMenuOpen
                      ? "bg-blue-50/80 border-blue-200 text-blue-700"
                      : "border-transparent text-slate-700 hover:text-blue-600 hover:bg-slate-100/80"
                  }`}
                  aria-label="Account menu"
                  aria-expanded={accountMenuOpen}
                >
                  {user ? (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-500/25 shrink-0">
                      {user.name ? user.name.trim().charAt(0).toUpperCase() : "A"}
                    </div>
                  ) : (
                    <CircleUser size={20} className="text-slate-600" />
                  )}
                  <div className="hidden xl:flex flex-col text-left leading-tight">
                    <span className="text-[11px] font-medium text-slate-400">
                      {user ? "Hello," : "Welcome"}
                    </span>
                    <span className="text-[13px] font-bold text-slate-800 max-w-[100px] truncate">
                      {user ? (user.name?.split(" ")[0] || "Account") : "Sign In"}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      accountMenuOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {accountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full mt-3 w-[330px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.04] backdrop-blur-2xl z-50"
                    >
                      {user ? (
                        <>
                          {/* User Profile Card */}
                          <div className="rounded-xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 p-3.5 border border-slate-200/70">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                                {user.name ? user.name.trim().charAt(0).toUpperCase() : "A"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-slate-900 leading-tight">
                                  {user.name || "Customer Account"}
                                </p>
                                <p className="truncate text-xs text-slate-500 mt-0.5">
                                  {user.email}
                                </p>
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full mt-1.5 border border-blue-200/60">
                                  <ShieldCheck size={12} className="text-blue-600" />
                                  Verified Customer
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Hub */}
                          <div className="mt-2.5 space-y-1">
                            {/* Dashboard */}
                            <button
                              onClick={() => navigateFromAccountMenu("/profile")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <LayoutDashboard size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                                  Account Dashboard
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Overview, stats & quick actions
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                            </button>

                            {/* My Orders */}
                            <button
                              onClick={() => navigateFromAccountMenu("/profile/orders")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Package size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                  My Orders & Tracking
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Track shipments, invoices & returns
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                            </button>

                            {/* Saved Addresses */}
                            <button
                              onClick={() => navigateFromAccountMenu("/profile/addresses")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <MapPin size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                                  Saved Addresses
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Manage delivery destinations
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                            </button>

                            {/* Wishlist */}
                            <button
                              onClick={() => navigateFromAccountMenu("/profile/wishlist")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                <Heart size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
                                  My Wishlist
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Saved smartphones & price drops
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
                            </button>

                            {/* Settings */}
                            <button
                              onClick={() => navigateFromAccountMenu("/profile/settings")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                                <Settings size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                                  Account Settings
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Profile info & security
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                            </button>

                            {/* Customer Support */}
                            <button
                              onClick={() => navigateFromAccountMenu("/contact")}
                              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Headphones size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                  Customer Support
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  24/7 helpdesk & order assistance
                                </div>
                              </div>
                              <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          </div>

                          <div className="my-2 h-px bg-slate-200/80" />

                          {/* Logout Button */}
                          <button
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 hover:bg-rose-50"
                          >
                            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                              <LogOut size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-bold text-rose-600 group-hover:text-rose-700">
                                Sign Out
                              </span>
                              <div className="text-[11px] text-rose-400">
                                Securely end your active session
                              </div>
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Guest Welcome Banner */}
                          <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white shadow-md shadow-blue-500/20">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Smartphone size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-extrabold tracking-tight">
                                  Welcome to OMMASTA
                                </p>
                                <p className="text-[11px] text-blue-100 mt-0.5">
                                  Premium Mobile Electronics
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-xs text-blue-50 leading-relaxed">
                              Sign in to view your orders, track shipments, and experience accelerated checkout.
                            </p>
                          </div>

                          <div className="mt-3 space-y-2">
                            <button
                              onClick={() => navigateFromAccountMenu("/login")}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-blue-500/25 transition-all"
                            >
                              <LogIn size={16} />
                              Sign In to Account
                            </button>

                            <button
                              onClick={() => navigateFromAccountMenu("/register")}
                              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 text-[13px] font-bold text-slate-700 transition-all"
                            >
                              <UserPlus size={16} />
                              Create New Account
                            </button>
                          </div>

                          <div className="my-2.5 h-px bg-slate-200/80" />

                          <div className="space-y-1">
                            <button
                              onClick={() => navigateFromAccountMenu("/profile/orders")}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100/70 hover:text-blue-600 transition-colors"
                            >
                              <Package size={15} className="text-slate-400" />
                              Track an Order
                            </button>

                            <button
                              onClick={() => navigateFromAccountMenu("/contact")}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100/70 hover:text-blue-600 transition-colors"
                            >
                              <Headphones size={15} className="text-slate-400" />
                              Help & 24/7 Support
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden flex items-center justify-center w-[42px] h-[42px] rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors duration-[250ms]"
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
                {navItems.map((item, i) => (
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
              <div className="px-4 py-4 border-t border-slate-100 space-y-1.5">
                {user ? (
                  <>
                    <div className="px-3 py-2.5 mb-2 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                        {user.name ? user.name.trim().charAt(0).toUpperCase() : "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { navigate("/profile"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <LayoutDashboard size={18} className="text-blue-600" /> Account Dashboard
                    </button>
                    <button onClick={() => { navigate("/profile/orders"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Package size={18} className="text-indigo-600" /> My Orders & Tracking
                    </button>
                    <button onClick={() => { navigate("/profile/addresses"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <MapPin size={18} className="text-amber-600" /> Saved Addresses
                    </button>
                    <button onClick={() => { navigate("/profile/wishlist"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Heart size={18} className="text-rose-600" /> My Wishlist
                    </button>
                    <button onClick={() => { navigate("/profile/settings"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Settings size={18} className="text-slate-600" /> Account Settings
                    </button>
                    <button onClick={() => { navigate("/contact"); setMobileOpen(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Headphones size={18} className="text-emerald-600" /> Customer Support
                    </button>
                    <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-2">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMobileOpen(false); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-[14px] font-bold text-white shadow-sm transition-colors">
                      <LogIn size={18} /> Sign In
                    </button>
                    <button onClick={() => { navigate("/register"); setMobileOpen(false); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-[14px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                      <UserPlus size={18} /> Create Account
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-[60px] md:h-[70px]" aria-hidden="true" />
    </>
  );
}

export default Header;
