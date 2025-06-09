import React, { useEffect, useState } from 'react';
import OrderList from '../components/orders/OrderList';
import { obtenerPedidosPendientes } from '../services/orderService';

const OrderDashboard = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const cargarPedidos = async () => {
      const data = await obtenerPedidosPendientes();
      setPedidos(data);
    };

    cargarPedidos();

    const interval = setInterval(cargarPedidos, 5000); // actualiza cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Pedidos Pendientes</h2>
      <OrderList pedidos={pedidos} />
    </div>
  );
};

export default OrderDashboard;
