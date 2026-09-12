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
      <div className="pt-8 sm:pt-12 lg:pt-16">
        <ServicesSection />
      </div>

      {/* BREATHING ROOM BETWEEN SERVICES AND TRUST */}
      <div className="h-8 sm:h-12 lg:h-16 bg-gradient-to-b from-slate-50 to-white"></div>

      {/* ASSURANCE & TRUST STRIP */}
      <div className="bg-white">
        <TrustStrip />
      </div>

      {/* BREATHING ROOM BETWEEN TRUST AND FOOTER */}
      <div className="h-8 sm:h-10 lg:h-12 bg-white"></div>
    </div>
  );
}

export default Home;
