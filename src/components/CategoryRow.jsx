import { useNavigate } from "react-router-dom";

function CategoryRow() {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Mobiles",
      icon: "📱",
      path: "/mobiles",
      color: "#2563eb"
    },
    {
      id: 2,
      name: "Accessories",
      icon: "🎧",
      path: "/accessories", 
      color: "#16a34a"
    },
    {
      id: 3,
      name: "Services",
      icon: "🔧",
      path: "/services",
      color: "#dc2626"
    },
    {
      id: 4,
      name: "Contact",
      icon: "📞",
      path: "/contact",
      color: "#7c3aed"
    }
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
              style={{ borderColor: category.color }}
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