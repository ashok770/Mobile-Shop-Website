import { useNavigate } from "react-router-dom";

function CategoryRow() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Mobiles",
      icon: "📱",
      path: "/mobiles",
      color: "#1428a0",
    },
    {
      id: 2,
      name: "Accessories",
      icon: "🎧",
      path: "/accessories",
      color: "#00873e",
    },
    {
      id: 3,
      name: "Services",
      icon: "🔧",
      path: "/services",
      color: "#e31837",
    },
    {
      id: 4,
      name: "Contact",
      icon: "📞",
      path: "/contact",
      color: "#ff6600",
    },
  ];

  return (
    <section className="category-row">
      <div className="container">
        <div className="category-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => navigate(category.path)}
              style={{ "--cat-color": category.color }}
            >
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryRow;
