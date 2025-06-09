// MenuPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const productosRestaurante1 = [
  {
    id: 1,
    nombre: "Hamburguesa Clásica",
    descripcion: "Carne 100% vacuna, lechuga, tomate, queso cheddar y mayonesa en pan artesanal.",
    precio: 2500
  },
  {
    id: 2,
    nombre: "Hamburguesa BBQ",
    descripcion: "Doble carne, panceta crocante, cebolla caramelizada, queso cheddar y salsa barbacoa.",
    precio: 3200
  }
];

const productosRestaurante2 = [
  {
    id: 1,
    nombre: "Combo Nigiri & Sashimi",
    descripcion: "6 nigiris de salmón y 6 sashimis frescos acompañados de wasabi y jengibre.",
    precio: 4200
  },
  {
    id: 2,
    nombre: "Combo Rolls Mixtos",
    descripcion: "12 piezas de rolls: Philadelphia, California, Tempura, y Tuna Roll.",
    precio: 3800
  }
];

const MenuPage = () => {
  const { id } = useParams();
  const restauranteId = parseInt(id);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([]);
  const [mesa, setMesa] = useState(null);

  useEffect(() => {
    // Cargar carrito desde localStorage
    const datos = localStorage.getItem('carrito');
    if (datos) {
      setCarrito(JSON.parse(datos));
    }

    // Obtener mesa de los parámetros URL y guardar en localStorage
    const params = new URLSearchParams(window.location.search);
    const mesaParam = params.get('mesa');
    if (mesaParam) {
      setMesa(mesaParam);
      localStorage.setItem('mesa', mesaParam);
    }

    // Guardar restauranteId en localStorage
    if (!isNaN(restauranteId)) {
      localStorage.setItem('restauranteId', restauranteId);
    }
  }, [restauranteId]); // Agregué restauranteId como dependencia

  const productos =
    restauranteId === 1
      ? productosRestaurante1
      : restauranteId === 2
      ? productosRestaurante2
      : [];

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carritoActual.findIndex(p => p.id === producto.id);

    if (index !== -1) {
      carritoActual[index].cantidad += 1;
    } else {
      carritoActual.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    setCarrito([...carritoActual]);
  };

  const quitarDelCarrito = (id) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    const index = carritoActual.findIndex(p => p.id === id);

    if (index !== -1) {
      if (carritoActual[index].cantidad > 1) {
        carritoActual[index].cantidad -= 1;
      } else {
        carritoActual.splice(index, 1);
      }
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    setCarrito([...carritoActual]);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="menu-page">
      <h2>
        Menú del Restaurante {restauranteId}
        {mesa && ` – Mesa ${mesa}`}
      </h2>

      {productos.length > 0 ? (
        productos.map(producto => (
          <div key={producto.id} className="menu-item">
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p><strong>${producto.precio}</strong></p>
            <button
              className="add-button"
              onClick={() => agregarAlCarrito(producto)}
            >
              Agregar al carrito
            </button>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles para este restaurante.</p>
      )}

      {carrito.length > 0 && (
        <div className="carrito">
          <h3>🛒 Mi pedido</h3>
          <ul>
            {carrito.map((item, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}
              >
                <span>
                  {item.nombre} – ${item.precio}
                </span>
                <div>
                  <button
                    onClick={() => quitarDelCarrito(item.id)}
                    className="boton-eliminar"
                  >
                    −
                  </button>
                  <span style={{ margin: '0 10px' }}>{item.cantidad}</span>
                  <button
                    onClick={() => agregarAlCarrito(item)}
                    className="boton-agregar"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p><strong>Total: ${total.toFixed(2)}</strong></p>

          <button onClick={() => navigate('/checkout')} className="boton-carrito">
            🛒 Mi pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;