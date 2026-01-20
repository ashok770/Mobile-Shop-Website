import "../styles/main.css";
import CategoryRow from "../components/CategoryRow";
import OfferSection from "../components/OfferSection";
import BelowThousandSection from "../components/BelowThousandSection";

function Home() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Mobile Shop</h1>
          <p>Your one-stop shop for mobiles & accessories</p>
        </div>
      </section>

      {/* CATEGORIES */}
      <CategoryRow />

      {/* OFFERS */}
      <BelowThousandSection />

      <OfferSection
        title="Mega Flash Sale"
        offerType="MEGA_FLASH_SALE"
        viewAllLink="/offers/mega-flash"
      />

      <OfferSection
        title="Buy 1 Get 1 Free"
        offerType="BUY_1_GET_1"
        viewAllLink="/offers/bogo"
      />

      <OfferSection
        title="Daily Special"
        offerType="DAILY_SPECIAL"
        viewAllLink="/offers/daily"
      />
    </div>
  );
}

export default Home;
