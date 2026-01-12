import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Mobiles from "./pages/Mobiles";
import Accessories from "./pages/Accessories";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Order from "./pages/Order";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<Order />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
