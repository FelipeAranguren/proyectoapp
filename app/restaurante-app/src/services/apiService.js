const API_URL = 'http://localhost:1337/api';

export async function obtenerPedidosPendientes() {
  const res = await fetch(`${API_URL}/pedidos?filters[estado][$eq]=Pendiente&populate[items][populate][producto]=*&populate=restaurante`);
  const data = await res.json();

  return data.data.map(pedido => ({
    id: pedido.id,
    mesa: pedido.attributes.numero_mesa,
    total: pedido.attributes.total,
    fecha: pedido.attributes.fecha_hora,
    restaurante: pedido.attributes.restaurante?.data?.attributes?.nombre || '',
    productos: pedido.attributes.items?.data?.map(item => ({
      nombre: item.attributes.producto?.data?.attributes?.nombre || 'Producto sin nombre',
      cantidad: item.attributes.cantidad,
      subtotal: item.attributes.subtotal,
    })) || [],
  }));
}
