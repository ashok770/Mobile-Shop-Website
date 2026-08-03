import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/carousel.css";

function Carousel() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=1200&h=500&fit=crop",
      title: "Latest iPhone Models",
      subtitle: "Get up to 30% off on premium Apple devices",
      tag: "Hot Deal",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=500&fit=crop",
      title: "Android Flagship Sale",
      subtitle: "Samsung, OnePlus & more at unbeatable prices",
      tag: "Limited Offer",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=500&fit=crop",
      title: "Budget Friendly Phones",
      subtitle: "Quality smartphones under ₹20,000",
      tag: "Best Value",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=1200&h=500&fit=crop",
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
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
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

      <div className="carousel-dots">
        {banners.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Carousel;
