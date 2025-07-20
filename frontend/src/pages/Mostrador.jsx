// src/pages/Mostrador.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  Button,
  Divider,
  Grid
} from '@mui/material';

export default function Mostrador() {
  const { slug } = useParams(); // el slug del restaurante desde la URL
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);

  const fetchPedidos = async () => {
    try {
      const res = await api.get(
        '/pedidos?populate[items][populate][product][populate]=restaurante'
      );

      const todosLosPedidos = res.data.data || [];
      const pedidosActivos = todosLosPedidos.filter(p => p.order_status !== 'served');

      // Filtrar pedidos del restaurante actual por el slug
      const pedidosFiltrados = pedidosActivos.filter(p =>
        p.items.every(item =>
          item.product?.restaurante?.slug === slug
        )
      );

      // Ordenar: pendientes primero
      pedidosFiltrados.sort((a, b) => {
        if (a.order_status === 'pending' && b.order_status !== 'pending') return -1;
        if (a.order_status !== 'pending' && b.order_status === 'pending') return 1;
        return 0;
      });

      setPedidos(pedidosFiltrados);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
      setError('No se pudieron cargar los pedidos.');
    }
  };

  const marcarComoServido = async (documentId) => {
    try {
      await api.put(`/pedidos/${documentId}`, {
        data: { order_status: 'served' }
      });
      setPedidos(prev => prev.filter(p => p.documentId !== documentId));
    } catch (err) {
      console.error('Error al marcar como servido:', err);
      setError('No se pudo actualizar el pedido.');
    }
  };

  const marcarComoRecibido = async (documentId) => {
    try {
      await api.put(`/pedidos/${documentId}`, {
        data: { order_status: 'preparing' }
      });

      setPedidos(prev =>
        prev.map(p =>
          p.documentId === documentId
            ? { ...p, order_status: 'preparing' }
            : p
        )
      );
    } catch (err) {
      console.error('Error al marcar como Recibido:', err);
      setError('No se pudo actualizar el pedido.');
    }
  };

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(fetchPedidos, 3000);
    return () => clearInterval(interval);
  }, [slug]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
  Mostrador - {slug.toUpperCase()}
</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {!error && pedidos.length === 0 && (
        <Typography>No hay pedidos activos.</Typography>
      )}

      <Grid container spacing={2}>
        {pedidos.map((pedido) => {
          const { id, documentId, table, order_status, customerNotes, items = [] } = pedido;
          return (
            <Grid item key={id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6">Mesa {table}</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color:
                        order_status === 'pending'
                          ? 'error.main'
                          : order_status === 'preparing'
                          ? 'warning.main'
                          : 'text.secondary',
                      fontWeight: 500
                    }}
                  >
                    Estado: {order_status || 'No definido'}
                  </Typography>

                  {customerNotes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Notas:</strong> {customerNotes}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <List sx={{ flexGrow: 1 }}>
                    {items.map(item => {
                      const prod = item.product;
                      return (
                        <ListItem key={item.id}>
                          {prod ? `${prod.name} x${item.quantity}` : 'Producto eliminado'}
                        </ListItem>
                      );
                    })}
                  </List>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {order_status !== 'preparing' && (
                      <Button
                        variant="outlined"
                        color="info"
                        onClick={() => marcarComoRecibido(documentId)}
                        fullWidth
                      >
                        Recibido
                      </Button>
                    )}
                    {order_status !== 'served' && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => marcarComoServido(documentId)}
                        fullWidth
                      >
                        Completado
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
