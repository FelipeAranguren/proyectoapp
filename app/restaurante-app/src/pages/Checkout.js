// src/pages/Checkout.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const unificarCarrito = (carritoCrudo) => {
  const mapa = new Map();
  for (const item of carritoCrudo) {
    if (mapa.has(item.id)) {
      const existente = mapa.get(item.id);
      existente.cantidad += item.cantidad || 1;
    } else {
      mapa.set(item.id, { ...item, cantidad: item.cantidad || 1 });
    }
  }
  return Array.from(mapa.values());
};

const Checkout = () => {
  const [carrito, setCarrito] = useState([]);
  const [restauranteId, setRestauranteId] = useState(null);
  const [mesa, setMesa] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const datos = localStorage.getItem('carrito');
    if (datos) {
      const carritoCrudo = JSON.parse(datos);
      const carritoLimpio = unificarCarrito(carritoCrudo);
      setCarrito(carritoLimpio);
      localStorage.setItem('carrito', JSON.stringify(carritoLimpio));
    }

    const restauranteIdGuardado = localStorage.getItem('restauranteId');
    const mesaGuardada = localStorage.getItem('mesa');
    if (restauranteIdGuardado) setRestauranteId(restauranteIdGuardado);
    if (mesaGuardada) setMesa(mesaGuardada);
  }, []);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const actualizarCarrito = (nuevoCarrito) => {
    const carritoUnificado = unificarCarrito(nuevoCarrito);
    setCarrito(carritoUnificado);
    localStorage.setItem('carrito', JSON.stringify(carritoUnificado));
  };

  const vaciarCarrito = () => {
    localStorage.removeItem('carrito');
    setCarrito([]);
  };

  const confirmarPedido = () => {
    localStorage.removeItem('carrito');
    setCarrito([]);
    const imagenConfirmacion = '/Marana-imagenes/tick.jpeg';
    localStorage.setItem('imagenConfirmacion', imagenConfirmacion);
    navigate('/orden-confirmada');
  };

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    actualizarCarrito(nuevoCarrito);
  };

  const quitarDelCarrito = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
    ).filter(p => p.cantidad > 0);
    actualizarCarrito(nuevoCarrito);
  };

  const volverAlMenu = () => {
    if (restauranteId) {
      navigate(`/menu/${restauranteId}${mesa ? `?mesa=${mesa}` : ''}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="checkout-page">
      <h2>🧾 Mi Pedido</h2>

      {carrito.length > 0 ? (
        <>
          <ul>
            {carrito.map((item) => (
              <li
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}
              >
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

          <div className="checkout-buttons">
            <button className="volver-menu" onClick={volverAlMenu}>Volver al Menú</button>
            <button className="vaciar" onClick={vaciarCarrito}>Vaciar carrito</button>
            <button className="confirmar" onClick={confirmarPedido}>Confirmar pedido</button>
          </div>
        </>
      ) : (
        <>
          <p>No hay productos en tu pedido.</p>
          <button className="volver-menu" onClick={volverAlMenu}>Volver al Menú</button>
        </>
      )}
    </div>
  );
};

export default Checkout;
