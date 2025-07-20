// src/pages/RestaurantMenu.jsx

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
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
      <Typography variant="h4" gutterBottom>
        Menú de {nombreRestaurante}
      </Typography>

      <Grid container spacing={3}>
        {productos.map(plato => (
          <Grid key={plato.id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                py: 0.8,
                px: 2
              }}
            >
              <Box sx={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 1 }}>
                <CardMedia
                  component="img"
                  image={plato.imagen}
                  alt={plato.nombre}
                  sx={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </Box>

              <CardContent sx={{ px: 0, py: 1, flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    fontSize: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '3rem'
                  }}
                >
                  {plato.nombre}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ mt: -2, mb: 1 }}
                >
                  ${plato.precio}
                </Typography>

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
                    fullWidth
                  >
                    Agregar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => removeItem(plato.id)}
                    fullWidth
                  >
                    Quitar
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <StickyFooter />
    </Container>
  )
}
