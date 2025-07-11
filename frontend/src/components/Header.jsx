// src/components/Header.jsx
import React from 'react'
import { AppBar, Toolbar, Typography, Button, Link } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* El título ahora apunta a "/" */}
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          underline="none"
          sx={{ flexGrow: 1 }}
        >
          <Typography variant="h6">Mi Restaurante QR</Typography>
        </Link>

        <Button color="inherit">Iniciar sesión</Button>
      </Toolbar>
    </AppBar>
  )
}
