// src/components/StickyFooter.jsx
import React, { useState } from 'react';
import {
  Paper, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
  List, ListItem, ListItemText
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { api } from '../api';

export default function StickyFooter() {
  const { items, subtotal, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState('');
  const [notes, setNotes] = useState('');

  if (items.length === 0) return null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    try {
      // 1. Crear el pedido base
      const pedidoRes = await api.post('/pedidos', {
        data: {
          table: Number(table),
          order_status: 'pending', // debe coincidir con tus opciones enum
          customerNotes: notes,
          total: subtotal,
        }
      });

      const pedidoId = pedidoRes.data.data.id;
      

      // 2. Crear ítems asociados al pedido
      await Promise.all(items.map(item =>
        api.post('/item-pedidos', {
          data: {
            product: {
  connect: [item.id]
},
            quantity: item.qty,
            notes: item.notes || '',
            UnitPrice: item.precio,
            totalPrice: item.qty * item.precio,
            order: {
  connect: [pedidoId]
} // <--- CORRECTO formato
          }
        })
      ));

      clearCart();
      setTable('');
      setNotes('');
      setOpen(false);
      console.log('Pedido e ítems creados correctamente');
    } catch (err) {
      console.error('Error al enviar pedido:', err.response?.data || err.message);
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Total: ${subtotal}</Typography>
        <Button variant="contained" size="large" onClick={handleOpen}>
          Enviar pedido
        </Button>
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Confirmar pedido</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Número de mesa"
            type="number"
            value={table}
            onChange={e => setTable(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Notas generales"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />
          <List>
            {items.map(item => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={`${item.nombre} x${item.qty}`}
                  secondary={`$${item.precio * item.qty}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Subtotal: <strong>${subtotal}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!table}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}