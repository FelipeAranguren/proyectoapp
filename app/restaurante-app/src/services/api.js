// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:1337/api';

export const obtenerRestaurantes = async () => {
  const res = await axios.get(`${API_URL}/restaurantes`);
  return res.data.data.map(r => ({
    id: r.id,
    ...r
  }));
};

export const obtenerProductosPorRestaurante = async (restauranteId) => {
  const res = await axios.get(`${API_URL}/productos`, {
    params: {
      'filters[restaurante][id][$eq]': restauranteId,
      populate: '*'
    }
  });

  return res.data.data.map(p => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: Array.isArray(p.descripcion)
      ? p.descripcion.map(block =>
          block.children.map(c => c.text).join('')
        ).join('\n')
      : p.descripcion,
    precio: p.precio,
    disponible: p.disponible
  }));
};
