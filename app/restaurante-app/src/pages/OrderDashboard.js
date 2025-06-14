import React, { useEffect, useState } from 'react';
import OrderList from '../components/orders/OrderList';
import { obtenerPedidosPendientes } from '../services/apiService';

const OrderDashboard = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await obtenerPedidosPendientes();
        setPedidos(data);
      } catch (err) {
        console.error('Error al obtener pedidos:', err);
      }
    };

    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000); // actualiza cada 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 Pedidos Pendientes</h2>
      <OrderList pedidos={pedidos} />
    </div>
  );
};

export default OrderDashboard;
