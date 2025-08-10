// src/pages/RestaurantMenu.jsx

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  CircularProgress
} from '@mui/material'
import { useCart } from '../context/CartContext'
import { api } from '../api'
import StickyFooter from '../components/StickyFooter'

const PLACEHOLDER = 'https://via.placeholder.com/600x400?text=No+Image'

export default function RestaurantMenu() {
  const { slug } = useParams()
  const [productos, setProductos] = useState(null)
  const [nombreRestaurante, setNombreRestaurante] = useState('')
  const { addItem, removeItem } = useCart()

  useEffect(() => {
    async function fetchProductosDelRestaurante() {
      try {
        const res = await api.get(
          `/restaurantes?filters[slug][$eq]=${slug}&populate[productos][populate][image]=true`
        )
        const restaurante = res.data.data[0]

        if (!restaurante) {
          setProductos([])
          return
        }

        setNombreRestaurante(restaurante.name || '')

        const base = import.meta.env.VITE_API_URL.replace('/api', '')
        const productosProcesados = (restaurante.productos || []).map(p => {
          const fm = p.image?.formats
          const urlRel =
            fm?.small?.url ||
            fm?.thumbnail?.url ||
            p.image?.url ||
            null
          const imagen = urlRel ? base + urlRel : PLACEHOLDER

          return {
            id: p.id,
            nombre: p.name,
            precio: p.price,
            imagen
          }
        })

        setProductos(productosProcesados)
      } catch (err) {
        console.error('Error cargando productos del restaurante:', err)
        setProductos([])
      }
    }

    fetchProductosDelRestaurante()
  }, [slug])

  if (productos === null) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    )
  }

  if (productos.length === 0) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6">
          No se encontró el restaurante o no tiene productos disponibles.
        </Typography>
      </Container>
    )
  }

  return (
    <Container sx={{ py: 7 }}>
      <Typography variant="h4" gutterBottom textAlign={'center'}>
        Menú de {nombreRestaurante}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          maxWidth: 480,
          mx: 'auto'
        }}
      >
        {productos.map(plato => (
          <Card
            key={plato.id}
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CardMedia
                component="img"
                image={plato.imagen}
                alt={plato.nombre}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  objectFit: 'cover'
                }}
              />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {plato.nombre}
                </Typography>
                <Typography variant="body2">${plato.precio}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() =>
                  addItem({
                    id: plato.id,
                    nombre: plato.nombre,
                    precio: plato.precio
                  })
                }
              >
                Agregar
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => removeItem(plato.id)}
              >
                Quitar
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      <StickyFooter />
    </Container>
  )
}