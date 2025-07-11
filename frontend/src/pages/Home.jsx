// src/pages/Home.jsx
import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material'
import { api } from '../api'

export default function Home() {
  const [rests, setRests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRests() {
      try {
        const res = await api.get('/restaurantes?populate=logo')
        const base = import.meta.env.VITE_API_URL.replace('/api', '')

        const list = res.data.data.map(r => {
          // extrae URL de logo (formats.small o url directo)
          const urlRel =
            r.logo?.formats?.small?.url ||
            r.logo?.formats?.thumbnail?.url ||
            r.logo?.url ||
            null

          return {
            id: r.id,
            name: r.name,
            slug: r.slug || String(r.id),
            logo: urlRel ? base + urlRel : null,
          }
        })

        setRests(list)
      } catch (err) {
        console.error('Error cargando restaurantes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRests()
  }, [])

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Restaurantes Disponibles
      </Typography>

      <Grid container spacing={3}>
        {rests.map(r => (
          <Grid key={r.id} item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {r.logo && (
                <CardMedia
                  component="img"
                  height="140"
                  image={r.logo}
                  alt={r.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent>
                <Typography variant="h6">{r.name}</Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button
                  component={RouterLink}
                  to={`/restaurantes/${r.slug}`}
                  variant="contained"
                  fullWidth
                >
                  Ver Menú
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
