// src/pages/Restaurantes.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerRestaurantes } from '../services/api';

const Restaurantes = () => {
  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await obtenerRestaurantes();
        setRestaurantes(data);
      } catch (error) {
        console.error("Error al cargar restaurantes:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="restaurantes-container">
      <h1>Restaurantes Disponibles</h1>
      <div className="restaurantes-grid">
        {restaurantes.map((restaurante) => (
          <div key={restaurante.id} className="restaurante-card">
            <div className="restaurante-header">
              <h2>{restaurante.nombre || "Sin nombre"}</h2>
              <span className="precio-categoria">{restaurante.suscripcion || "Plan no asignado"}</span>
            </div>

            <div className="restaurante-info">
              <span>📍 {restaurante.direccion || "Sin dirección"}</span>
              <span>📞 {restaurante.telefono || "Sin teléfono"}</span>
            </div>

            <Link to={`/menu/${restaurante.id}`} className="ver-menu-btn">
              Ver Menú
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurantes;
