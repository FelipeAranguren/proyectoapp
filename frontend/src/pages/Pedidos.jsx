// src/pages/Pedidos.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { api } from '../api';

const estados = [
  { key: 'nuevo',        label: 'Nuevos',      color: 'primary' },
  { key: 'preparando',   label: 'En preparación', color: 'warning' },
  { key: 'listo',        label: 'Listos para servir', color: 'success' },
  { key: 'servido',      label: 'Servidos',    color: 'default' },
  { key: 'cancelado',    label: 'Cancelados',  color: 'error' }
];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  // Fetch inicial y cada 10s
  useEffect(() => {
    let timer;
    const fetchPedidos = async () => {
      try {
        const res = await api.get('/pedidos?populate=items.producto');
        setPedidos(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPedidos();
    timer = setInterval(fetchPedidos, 10000);
    return () => clearInterval(timer);
  }, []);

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await api.put(`/pedidos/${pedidoId}`, {
        data: { order_status: nuevoEstado }
      });
      setPedidos(pedidos.map(p =>
        p.id === pedidoId
          ? { ...p, attributes: { ...p.attributes, order_status: nuevoEstado } }
          : p
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>Panel de Pedidos</Typography>

      {estados.map(estado => {
        const lista = pedidos.filter(p => p.attributes.order_status === estado.key);
        return (
          <Box key={estado.key} mb={4}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Chip label={estado.label} color={estado.color} />
              <Typography variant="subtitle1">({lista.length})</Typography>
            </Stack>
            {lista.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No hay pedidos.</Typography>
            ) : (
              <Grid container spacing={2}>
                {lista.map(p => {
                  const { id, attributes: attr } = p;
                  const created = new Date(attr.publishedAt).toLocaleTimeString();
                  const items = attr.items.data;
                  const subtotal = items.reduce(
                    (sum, i) => sum + i.attributes.quantity * i.attributes.unitPrice, 0
                  );

                  return (
                    <Grid item xs={12} md={6} lg={4} key={id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Mesa {attr.table}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {created}
                          </Typography>
                          <Divider sx={{ my: 1 }} />

                          {items.map(item => (
                            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography>{item.attributes.product.data.attributes.name} x{item.attributes.quantity}</Typography>
                              <Typography>${item.attributes.quantity * item.attributes.unitPrice}</Typography>
                            </Box>
                          ))}

                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle1">Subtotal: <strong>${subtotal}</strong></Typography>

                          <Stack direction="row" spacing={1} mt={2}>
                            {estado.key === 'nuevo' && (
                              <Button size="small" onClick={() => cambiarEstado(id, 'preparando')}>
                                Marcar en preparación
                              </Button>
                            )}
                            {estado.key === 'preparando' && (
                              <Button size="small" onClick={() => cambiarEstado(id, 'listo')}>
                                Marcar listo
                              </Button>
                            )}
                            {['nuevo','preparando','listo'].includes(estado.key) && (
                              <Button
                                size="small"
                                color="error"
                                onClick={() => cambiarEstado(id, 'cancelado')}
                              >
                                Cancelar
                              </Button>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
