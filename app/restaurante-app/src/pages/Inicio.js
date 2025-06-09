import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Inicio.css';

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="fondo-completo">
      <div className="contenido">
        <h1>Bienvenido a MARAÑA</h1>
        <div className="texto-destacado">
          Escanear el código QR para ver el menú y realizar tu pedido o Descubri los Restaurantes Disponibles
        </div>
        
        <div className="botones-container">
          <button 
            className="boton-accion"
            onClick={() => console.log('Escanear QR')} // Aquí integrarías tu lógica de escaneo
          >
            Escanear QR
          </button>
          
          <button 
            className="boton-accion"
            onClick={() => navigate('/restaurantes')} // Navega a la página de restaurantes
          >
            Ver Restaurantes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;