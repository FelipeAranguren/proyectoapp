import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ pedidos }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {pedidos.map(pedido => (
        <OrderCard key={pedido.id} pedido={pedido} />
      ))}
    </div>
  );
};

export default OrderList;
