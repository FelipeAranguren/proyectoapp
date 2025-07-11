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
  CardActions,
  Button,
  CircularProgress
} from '@mui/material'
import { useCart } from '../context/CartContext'
import { api } from '../api'
import StickyFooter from '../components/StickyFooter'

// Imagen fallback si no hay
const PLACEHOLDER = 'https://via.placeholder.com/600x400?text=No+Image'

export default function RestaurantMenu() {
  const { slug } = useParams()
  const [categories, setCategories] = useState(null)  // null = cargando
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await api.get(
          `/restaurantes?filters[slug][$eq]=${slug}&populate=categorias.productos.image`
        )
        console.log('Restaurant raw:', res.data)

        const r = res.data.data[0]
        if (!r) {
          setCategories([])
          return
        }

        const base = import.meta.env.VITE_API_URL.replace('/api', '')
        const cats = (r.categorias || []).map(cat => ({
          id: cat.id,
          nombre: cat.name,
          productos: (cat.productos || []).map(p => {
            // Strapi devuelve p.image como objeto plano:
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
        }))

        setCategories(cats)
      } catch (err) {
        console.error('Error cargando restaurante:', err)
        setCategories([])  // evita bloqueos
      }
    }
    fetchRestaurant()
  }, [slug])

  // loading
  if (categories === null) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    )
  }

  // no encontrado o sin categorías
  if (categories.length === 0) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6">
          No se encontró el restaurante o no tiene menú.
        </Typography>
      </Container>
    )
  }

  // render del menú
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Menú del Restaurante
      </Typography>

      {categories.map(cat => (
        <Box key={cat.id} mb={6}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {cat.nombre}
          </Typography>
          <Grid container spacing={3}>
            {cat.productos.map(plato => (
              <Grid key={plato.id} item xs={12} sm={6} md={4} lg={3}>
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ width: '100%', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={plato.imagen}
                      alt={plato.nombre}
                      sx={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{plato.nombre}</Typography>
                    <Typography>${plato.precio}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
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
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <StickyFooter />
    </Container>
  )
}
