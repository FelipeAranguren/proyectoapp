import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Restaurantes from './pages/Restaurantes';
import MenuPage from './pages/MenuPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDashboard from './pages/OrderDashboard'; // 👈 nuevo import

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orden-confirmada" element={<OrderSuccess />} />
        <Route path="/dashboard" element={<OrderDashboard />} /> {/* 👈 nueva ruta */}
      </Routes>
    </Router>
  );
}

export default App;
// forzar cambio para Git