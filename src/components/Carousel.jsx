import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carousel.css";

function Carousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      /*
        FIX 5: wider image request (w=1400) for sharper rendering on large screens.
        bgPos: "center right" pushes the phone subject to the right half,
        leaving the left side clean for the text overlay.
      */
      image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=1400&h=500&fit=crop",
      bgPos: "center right",
      title: "Latest iPhone Models",
      subtitle: "Get up to 30% off on premium Apple devices",
      tag: "Hot Deal",
    },
    {
      id: 2,
      /*
        FIX 5: original image was laptops — off-brand for a mobile shop.
        Replaced with a Samsung/Android-focused smartphone image.
        bgPos: "center right" keeps device on the right, text on the left.
      */
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1400&h=500&fit=crop",
      bgPos: "center right",
      title: "Android Flagship Sale",
      subtitle: "Samsung, OnePlus & more at unbeatable prices",
      tag: "Limited Offer",
    },
    {
      id: 3,
      /*
        FIX 5: original was a watch — completely off-brand.
        Replaced with a budget smartphone image.
        bgPos: "center" keeps the subject centered under the overlay.
      */
      image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1400&h=500&fit=crop",
      bgPos: "center",
      title: "Budget Friendly Phones",
      subtitle: "Quality smartphones under ₹20,000",
      tag: "Best Value",
    },
    {
      id: 4,
      /*
        FIX 5: bgPos "right 30%" keeps the person's face visible on the right
        while the left side stays uncluttered for the text overlay.
      */
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1400&h=500&fit=crop",
      bgPos: "right 30%",
      title: "Exclusive Accessories",
      subtitle: "Complete your mobile experience",
      tag: "New Arrivals",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleShopNow = () => {
    navigate("/mobiles");
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `url(${banner.image})`,
              /* FIX 5: per-slide focal point — subject right, text left */
              backgroundPosition: banner.bgPos,
            }}
            /* FIX 9: hide inactive slides from assistive technology */
            aria-hidden={index !== currentSlide}
          >
            <div className="carousel-overlay" />
            {/*
              FIX 9: aria-live="polite" on the active slide's content so screen
              readers announce the new slide title when it changes.
              aria-atomic="true" reads the whole block, not just the changed part.
            */}
            <div
              className="carousel-content"
              aria-live={index === currentSlide ? "polite" : undefined}
              aria-atomic="true"
            >
              <span className="carousel-tag">{banner.tag}</span>
              <h1>{banner.title}</h1>
              <p>{banner.subtitle}</p>
              <button className="carousel-btn" onClick={handleShopNow}>
                Shop Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-nav prev" onClick={prevSlide} aria-label="Previous slide">
        &#10094;
      </button>
      <button className="carousel-nav next" onClick={nextSlide} aria-label="Next slide">
        &#10095;
      </button>

      <div className="carousel-dots" role="tablist" aria-label="Slide indicators">
        {banners.map((banner, index) => (
          <span
            key={index}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Go to slide ${index + 1}: ${banner.title}`}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
