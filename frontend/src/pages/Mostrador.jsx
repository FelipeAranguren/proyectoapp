// src/pages/Mostrador.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  Divider
} from '@mui/material';

export default function Mostrador() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    try {
      const res = await api.get('/pedidos?populate[items][populate]=product');
      console.log('Pedidos recibidos:', res.data.data);  // Siempre revisar aquí
      setPedidos(res.data.data || []);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setError('No se pudieron cargar los pedidos.');
    }
  };

  const marcarComoServido = async (pedidoId) => {
    console.log('Intentando actualizar pedido:', pedidoId);
    try {
      await api.put(`/pedidos/$?{pedidoId}`, {
        data: { order_status: 'served' }  // Verificá que sea "served"
      });
      setPedidos(prev => prev.filter(p => p.id !== pedidoId));
    } catch (err) {
      console.error('Error al marcar como servido:', err);
      setError('No se pudo actualizar el pedido.');
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Mostrador</Typography>
      { error && <Typography color="error">{error}</Typography> }
      { !error && pedidos.length === 0 && (
        <Typography>No hay pedidos activos.</Typography>
      ) }

      { pedidos.map((pedido) => {
          const { id, table, order_status, customerNotes, items = [] } = pedido;
          return (
            <Card key={id} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6">Mesa {table}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado: {order_status || 'No definido'}
                </Typography>
                { customerNotes && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Notas:</strong> {customerNotes}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} />
                <List>
                  { items.map(item => {
                      const prod = item.product;
                      return (
                        <ListItem key={item.id}>
                          { prod ? `${prod.name} x${item.quantity}` : 'Producto eliminado' }
                        </ListItem>
                      );
                  })}
                </List>

                { order_status !== 'served' && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => marcarComoServido(id)}
                  >
                    Marcar como servido
                  </Button>
                )}
              </CardContent>
            </Card>
          );
      })}
    </Box>
  );
}
