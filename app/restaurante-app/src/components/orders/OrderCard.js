import React from 'react';

const OrderCard = ({ pedido }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 m-2 w-full sm:w-72">
      <h4 className="text-lg font-semibold">Mesa {pedido.mesa}</h4>
      <ul className="mt-2">
        {pedido.productos.map((item, idx) => (
          <li key={idx} className="text-sm">
            {item.nombre} x{item.cantidad}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;

