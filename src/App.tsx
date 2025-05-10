import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import SolutionsPage from './pages/SolutionsPage';
import ContactPage from './pages/ContactPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
        <ScrollToTop/>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
