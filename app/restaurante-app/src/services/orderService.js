//para conectar con strapi

const API_URL = 'http://localhost:1337/api/pedidos';

export async function obtenerPedidosPendientes() {
  const res = await fetch(`${API_URL}?filters[estado][$eq]=pendiente&populate=*`);
  const data = await res.json();
  return data.data.map(p => ({
    id: p.id,
    mesa: p.attributes.mesa,
    productos: p.attributes.productos,
    estado: p.attributes.estado
  }));
}
