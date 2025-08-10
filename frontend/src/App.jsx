import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'
import RestaurantMenu from './pages/RestaurantMenu'
import Mostrador from './pages/Mostrador'
import CargarProducto from './pages/CargarProductos'

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurantes" element={<Restaurants />} />
        <Route path="/restaurantes/:slug" element={<RestaurantMenu />} />
        <Route path="/mostrador/:slug" element={<Mostrador />} />
        <Route path="/cargarproductos/:slug" element={<CargarProducto />} />
      </Routes>
    </BrowserRouter>
  )
}
