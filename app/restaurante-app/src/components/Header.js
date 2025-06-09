import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Podés crear este archivo para estilos propios

const Header = () => {
  return (
    <header className="header">
      <div className="logo">🍽️ MARAÑA</div>
      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/restaurantes">Ver Restaurantes</Link>
        <Link to="/checkout">Mi Pedido</Link>
      </nav>
    </header>
  );
};

export default Header;