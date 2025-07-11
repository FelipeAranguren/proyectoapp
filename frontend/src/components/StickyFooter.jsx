// src/components/StickyFooter.jsx
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { api } from '../api';

export default function StickyFooter() {
  const { items, subtotal, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState('');
  const [notes, setNotes] = useState('');

  // No mostramos nada si el carrito está vacío
  if (items.length === 0) return null;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    // Construimos el payload según tu schema de Strapi
    const payload = {
      data: {
        table: Number(table),
        order_status: 'nuevo',
        customerNotes: notes,
        total: subtotal,
        items: items.map(item => ({
          producto: item.id,
          cantidad: item.qty,
          notas: item.notes || '',
          unitPrice: item.precio,
          totalPrice: item.qty * item.precio,
        })),
      }
    };

    try {
      const res = await api.post('/pedidos', payload);
      console.log('Pedido enviado:', res.data);
      clearCart();        // Vaciamos el carrito
      setTable('');       // Reseteamos formulario
      setNotes('');
      setOpen(false);     // Cerramos el diálogo
      // Aquí podrías disparar un Snackbar de éxito
    } catch (err) {
      console.error('Error al enviar pedido:', err);
      // Y aquí un Snackbar de error
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
          {/* Número de mesa */}
          <TextField
            label="Número de mesa"
            type="number"
            value={table}
            onChange={e => setTable(e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* Notas generales */}
          <TextField
            label="Notas generales"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
          />

          {/* Listado de ítems */}
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
