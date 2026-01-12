function Accessories() {
  const accessories = [
    {
      id: 1,
      name: "Fast Charger",
      price: 999,
      image: "/images/accessories/charger.jpg",
    },
    {
      id: 2,
      name: "Wireless Earphones",
      price: 1999,
      image: "/images/accessories/earphones.jpg",
    },
    {
      id: 3,
      name: "Mobile Cover",
      price: 499,
      image: "/images/accessories/cover.jpg",
    },
    {
      id: 4,
      name: "Power Bank",
      price: 1499,
      image: "/images/accessories/powerbank.jpg",
    },
  ];

  return (
    <div className="mobiles">
      <h2>Accessories</h2>

      <div className="mobile-list">
        {accessories.map((item) => (
          <div className="mobile-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>

            <a
              href={`https://wa.me/919876543210?text=I want to order ${item.name}`}
              target="_blank"
              className="btn order-btn"
            >
              Order on WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Accessories;
