// src/pages/Restaurants.jsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container, Typography, Grid,
  Card, CardMedia, CardContent, CardActions, Button
} from '@mui/material'
import { api } from '../api'

const PLACEHOLDER = 'https://via.placeholder.com/300x200?text=No+Logo'

export default function Restaurants() {
  const [restos, setRestos] = useState([])

  useEffect(() => {
    api.get('/restaurantes?populate=logo').then(res => {
      setRestos(res.data.data)
    })
  }, [])

  const base = import.meta.env.VITE_API_URL.replace('/api', '')

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Nuestros Restaurantes
      </Typography>
      <Grid container spacing={3}>
        {restos.map(r => {
          const logoUrl = r.attributes.logo
            ? base + (r.attributes.logo.formats?.thumbnail?.url || r.attributes.logo.url)
            : PLACEHOLDER

          return (
            <Grid key={r.id} item xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={logoUrl}
                  alt={r.attributes.name}
                />
                <CardContent>
                  <Typography variant="h6">
                    {r.attributes.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/restaurantes/${r.attributes.slug}`}
                    fullWidth
                    variant="contained"
                  >
                    Ver Menú
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}
