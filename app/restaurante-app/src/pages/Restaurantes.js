import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Restaurantes = () => {
  const restaurantes = [
    { id: 1,
       nombre: "Restaurante 1",
       categoria: "Helados",
       precio: "$$$",
       destacado: "Hasta 47% OFF",
       tiempo: "10-25 min",
       etiqueta: "",
       logo: ""      
      },
    { id: 2,
       nombre: "Restaurante 2",
       categoria: "Sushi",
       precio: "$$$$",
       destacado: "Hasta 47% OFF",
       tiempo: "20-35 min",
       etiqueta: "" 
     },
    { id: 3,
       nombre: "Restaurante 3",
       categoria: "Comida rápida",
       precio: "$$",
       destacado: "Hasta 47% OFF",
       tiempo: "15-30 min",
       etiqueta: ""
     },
    { id: 4,
       nombre: "Restaurante 4",
       categoria: "Helados",         
       precio: "$$$",
       destacado: "Hasta 47% OFF",
       tiempo: "10-25 min", etiqueta: "" 
    },
    { id: 5, 
      nombre: "Restaurante 5", 
      categoria: "Sushi", 
      precio: "$$$$", 
      destacado: "Hasta 47% OFF", 
      tiempo: "20-35 min", 
      etiqueta: "" 
    },
    { id: 6, 
      nombre: "Restaurante 6", 
      categoria: "Comida rápida", 
      precio: "$$", 
      destacado: "Hasta 47% OFF", 
      tiempo: "15-30 min", 
      etiqueta: ""
    },
    { id: 7, 
      nombre: "Restaurante 7", 
      categoria: "Helados", 
      precio: "$$$", 
      destacado: "DESCUENTOS FUGACES", 
      tiempo: "10-25 min", 
      etiqueta: "" 
    },
    { id: 8, 
      nombre: "Restaurante 8", 
      categoria: "Sushi", 
      precio: "$$$$", 
      destacado: "Hasta 47% OFF", 
      tiempo: "20-35 min", 
      etiqueta: "" 
    },
    { id: 9, 
      nombre: "Restaurante 9", 
      categoria: "Comida rápida", 
      precio: "$$", 
      estacado: "Hasta 47% OFF", 
      tiempo: "15-30 min", 
      etiqueta: "" 
    },
  ];

  return (
    <div className="restaurantes-container">
      <h1>Restaurantes Disponibles</h1>
      <div className="restaurantes-grid">
        {restaurantes.map((restaurante) => (
          <div key={restaurante.id} className="restaurante-card">
            {/* Contenido de la tarjeta igual al anterior */}
            <div className="restaurante-header">
              <h2>{restaurante.nombre}</h2>
              <span className="precio-categoria">{restaurante.precio} · {restaurante.categoria}</span>
            </div>
            
            {restaurante.destacado && (
              <div className="destacado-badge">
                {restaurante.destacado}
              </div>
            )}

            <div className="restaurante-info">
              <span>{restaurante.tiempo}</span>
              <span className="Espera-info">
                {restaurante.envioGratis ? "✅" : ""} Espera {restaurante.envio}
              </span>
            </div>

            <div className="restaurante-etiqueta">
              {restaurante.etiqueta}
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