import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Event";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import PackageDetail from "./pages/PackageDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import Booking from "./pages/Booking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages/:id" element={<PackageDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <Booking />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
