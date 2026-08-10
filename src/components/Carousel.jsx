import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carousel.css";
import iphoneBanner from "../banners/banner-iphone.png";
import samsungBanner from "../banners/banner-samsung.png";
import accessoriesBanner from "../banners/banner-accessories.png";
import dealsBanner from "../banners/banner-deals.png";

const BANNERS = [
  {
    id: 1,
    image: iphoneBanner,
    destination: "/mobiles?brand=Apple",
    alt: "iPhone premium devices offer",
  },
  {
    id: 2,
    image: samsungBanner,
    destination: "/mobiles?brand=Samsung",
    alt: "Samsung smartphone offer",
  },
  {
    id: 3,
    image: accessoriesBanner,
    destination: "/accessories",
    alt: "Mobile accessories offer",
  },
  {
    id: 4,
    image: dealsBanner,
    destination: "/",
    alt: "Mobile deals offer",
  },
];

function Carousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            onClick={() => navigate(banner.destination)}
            aria-hidden={index !== currentSlide}
            aria-label={`View ${banner.alt}`}
            tabIndex={index === currentSlide ? 0 : -1}
          >
            <img className="carousel-banner-image" src={banner.image} alt="" />
          </button>
        ))}
      </div>

      <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className="carousel-nav next" onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>

      <div className="carousel-dots" role="tablist" aria-label="Slide indicators">
        {BANNERS.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to ${banner.alt}`}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
