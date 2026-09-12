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
  return (
    <div className="home-page">
      {/* HERO CAROUSEL */}
      <Carousel />

      {/* DISCOVERY: SHOP BY BRAND */}
      <ShopByBrand />

      {/* PRIMARY DEAL */}
      <FeaturedDealSection />

      {/* VALUE: BELOW ₹1,000 */}
      <BelowThousandSection />

      {/* OFFERS & PROMOTIONS */}
      <OfferSection
        title="Mega Flash Sale"
        offerType="MEGA_FLASH_SALE"
        viewAllLink="/offers/mega-flash"
        variant="flash"
      />

      <OfferSection
        title="Buy 1 Get 1 Free"
        offerType="BUY_1_GET_1"
        viewAllLink="/offers/bogo"
        variant="bogo"
      />

      <OfferSection
        title="Daily Special"
        offerType="DAILY_SPECIAL"
        viewAllLink="/offers/daily"
        variant="daily"
      />

      {/* FRESHNESS */}
      <NewArrivalsSection />
      
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
