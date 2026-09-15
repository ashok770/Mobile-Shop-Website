import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carousel.css";
import iphoneBanner from "../banners/banner-iphone.webp";
import samsungBanner from "../banners/banner-samsung.webp";
import accessoriesBanner from "../banners/banner-accessories.webp";
import dealsBanner from "../banners/banner-deals.webp";

const BANNERS = [
  {
    id: 1,
    image: iphoneBanner,
    destination: "/mobiles?brand=Apple",
    alt: "iPhone premium devices offer",
    bgColor: "#000000",
  },
  {
    id: 2,
    image: samsungBanner,
    destination: "/mobiles?brand=Samsung",
    alt: "Samsung smartphone offer",
    bgColor: "#000000",
  },
  {
    id: 3,
    image: accessoriesBanner,
    destination: "/accessories",
    alt: "Mobile accessories offer",
    bgColor: "#080808",
  },
  {
    id: 4,
    image: dealsBanner,
    destination: "/",
    alt: "Mobile deals offer",
    bgColor: "#050508",
  },
];

function Carousel({ slides }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = slides && slides.length > 0 
    ? slides.filter(s => s.isActive !== false) 
    : BANNERS;

  // Add a safe fallback in case all dynamic slides are inactive
  const displaySlides = activeSlides.length > 0 ? activeSlides : BANNERS;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displaySlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container" role="region" aria-label="Featured Promotions">
      <div className="carousel-wrapper">
        {displaySlides.map((banner, index) => (
          <button
            key={banner.id || banner._id || index}
            type="button"
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundColor: banner.bgColor || "#000000" }}
            onClick={() => navigate(banner.destination)}
            aria-hidden={index !== currentSlide}
            aria-label={`View ${banner.alt}`}
            tabIndex={index === currentSlide ? 0 : -1}
          >

            <div className="carousel-fg-layer">
              <img
                className="carousel-banner-image"
                src={banner.image}
                alt={banner.alt}
              />
            </div>
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
        {displaySlides.map((banner, index) => (
          <button
            key={banner.id || banner._id || index}
            type="button"
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}: ${banner.alt}`}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
