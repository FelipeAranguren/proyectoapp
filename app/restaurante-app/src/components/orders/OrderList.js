import React from 'react';

const OrderList = ({ pedidos }) => {
  return (
    <div>
      {pedidos.map((pedido, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 12 }}>
          <h3>Mesa: {pedido.mesa}</h3>
          <p><strong>Restaurante:</strong> {pedido.restaurante}</p>
          <p><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
          <ul>
            {pedido.productos.map((item, i) => (
              <li key={i}>
                {item.nombre} × {item.cantidad} = ${item.subtotal.toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Total: ${pedido.total.toFixed(2)}</strong></p>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
