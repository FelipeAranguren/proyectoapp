import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box
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
          const { name, slug, logo } = r.attributes

          const logoUrl = logo
            ? base + (logo.formats?.thumbnail?.url || logo.url)
            : PLACEHOLDER

          return (
            <Grid key={r.id} item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ overflow: 'hidden', borderRadius: 2 }}>
                <Box sx={{ height: 140 }}>
                  <img
                    src={logoUrl}
                    alt={name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px',
                      display: 'block'
                    }}
                  />
                </Box>

                <CardContent>
                  <Typography variant="h6">{name}</Typography>
                </CardContent>

                <CardActions>
                  <Button
                    component={Link}
                    to={slug ? `/restaurantes/${slug}` : '#'}
                    fullWidth
                    variant="contained"
                    disabled={!slug}
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
