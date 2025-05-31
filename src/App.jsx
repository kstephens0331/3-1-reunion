import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Reunion from "./pages/Reunion";
import Gallery from "./pages/Gallery";
import Fallen from "./pages/Fallen";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen text-black">
        <Navbar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reunion" element={<Reunion />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/fallen" element={<Fallen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
