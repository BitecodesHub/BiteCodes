import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from "./components/Footer";
import { MainPage } from './components/MainPage';
import { Navbar } from "./components/Navbar";
import { Projects } from './components/Project';
import { Services } from './components/Services';
import './css/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
        <Footer/>  
      </div>
    </Router>
  );
}

export default App;
