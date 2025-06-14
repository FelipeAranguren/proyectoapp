import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductosPorRestaurante } from '../services/api';

const MenuPage = () => {
  const { id } = useParams();
  const restauranteId = Number(id);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mesa, setMesa] = useState(null);

  // Cargar productos
  useEffect(() => {
    (async () => {
      try {
        const prod = await obtenerProductosPorRestaurante(restauranteId);
        setProductos(prod);
      } catch (e) {
        console.error('Error cargando productos:', e);
      }
    })();
    // Configuración de carrito y mesa (igual que antes)
    const savedCart = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(savedCart);

    const params = new URLSearchParams(window.location.search);
    const mesaParam = params.get('mesa');
    if (mesaParam) {
      setMesa(mesaParam);
      localStorage.setItem('mesa', mesaParam);
    }
    if (!isNaN(restauranteId)) {
      localStorage.setItem('restauranteId', restauranteId);
    }
  }, [restauranteId]);

  // Carrito
  const agregarAlCarrito = (prod) => {
    let updated = [...carrito];
    const idx = updated.findIndex(p => p.id === prod.id);
    if (idx !== -1) {
      updated[idx].cantidad += 1;
    } else {
      updated.push({ ...prod, cantidad: 1 });
    }
    setCarrito(updated);
    localStorage.setItem('carrito', JSON.stringify(updated));
  };

  const quitarDelCarrito = (id) => {
    let updated = [...carrito];
    const idx = updated.findIndex(p => p.id === id);
    if (idx !== -1) {
      if (updated[idx].cantidad > 1) updated[idx].cantidad -= 1;
      else updated.splice(idx, 1);
    }
    setCarrito(updated);
    localStorage.setItem('carrito', JSON.stringify(updated));
  };

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div className="menu-page">
      <h2>
        Menú del Restaurante {restauranteId}
        {mesa && ` – Mesa ${mesa}`}
      </h2>

      {productos.length ? (
        productos.map(producto => (
          <div key={producto.id} className="menu-item">
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p><strong>${producto.precio}</strong></p>
            <button className="add-button" onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles para este restaurante.</p>
      )}

      {/* Carrito */}
      {carrito.length > 0 && (
        <div className="carrito">
          <h3>🛒 Mi pedido</h3>
          <ul>
            {carrito.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.nombre} – ${item.precio}</span>
                <div>
                  <button onClick={() => quitarDelCarrito(item.id)} className="boton-eliminar">−</button>
                  <span style={{ margin: '0 10px' }}>{item.cantidad}</span>
                  <button onClick={() => agregarAlCarrito(item)} className="boton-agregar">+</button>
                </div>
              </li>
            ))}
          </ul>
          <p><strong>Total: ${total.toFixed(2)}</strong></p>
          <button className="boton-carrito" onClick={() => navigate('/checkout')}>
            🛒 Mi pedido
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
