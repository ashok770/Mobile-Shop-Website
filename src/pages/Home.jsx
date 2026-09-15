import { useEffect, useState } from "react";
import { getHomepageConfig } from "../api/api";
import "../styles/main.css";
import Carousel from "../components/Carousel";
import ShopByBrand from "../components/ShopByBrand";
import OfferSection from "../components/OfferSection";
import BelowThousandSection from "../components/BelowThousandSection";
import NewArrivalsSection from "../components/NewArrivalsSection";
import FeaturedDealSection from "../components/FeaturedDealSection";
import ServicesSection from "../components/ServicesSection";
import TrustStrip from "../components/TrustStrip";

function Home() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    getHomepageConfig()
      .then(setConfig)
      .catch((err) => console.error("Failed to load homepage config:", err));
  }, []);

  const sections = config?.sections || {
    belowThousand: true,
    megaFlashSale: true,
    buy1Get1: true,
    dailySpecial: true,
    newArrivals: true,
  };
  return (
    <div className="home-page">
      {/* HERO CAROUSEL */}
      <Carousel slides={config?.heroSlides} />

      {/* DISCOVERY: SHOP BY BRAND */}
      <ShopByBrand />

      {/* PRIMARY DEAL */}
      <FeaturedDealSection featuredDealProductId={config?.featuredDealProductId} />

      {/* VALUE: BELOW ₹1,000 */}
      {sections.belowThousand && <BelowThousandSection />}

      {/* OFFERS & PROMOTIONS */}
      {sections.megaFlashSale && (
        <OfferSection
          title="Mega Flash Sale"
          offerType="MEGA_FLASH_SALE"
          viewAllLink="/offers/mega-flash"
          variant="flash"
        />
      )}

      {sections.buy1Get1 && (
        <OfferSection
          title="Buy 1 Get 1 Free"
          offerType="BUY_1_GET_1"
          viewAllLink="/offers/bogo"
          variant="bogo"
        />
      )}

      {sections.dailySpecial && (
        <OfferSection
          title="Daily Special"
          offerType="DAILY_SPECIAL"
          viewAllLink="/offers/daily"
          variant="daily"
        />
      )}

      {/* FRESHNESS */}
      {sections.newArrivals && <NewArrivalsSection />}
      
      {/* CONFIDENCE & SERVICES — Why Ommastra Section */}
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <ServicesSection />
      </div>

      {/* RENDERED SPACING (Services -> TrustStrip) */}
      <div className="h-4 sm:h-6 lg:h-8 w-full" aria-hidden="true" />

      {/* ASSURANCE & TRUST STRIP */}
      <div>
        <TrustStrip />
      </div>

      {/* RENDERED SPACING (TrustStrip -> Footer removed for natural transition) */}
    </div>
  );
}

export default Home;
