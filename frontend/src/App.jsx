// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Restaurants from './pages/Restaurants'           // <-- listado de restaurantes
import RestaurantMenu from './pages/RestaurantMenu'     // <-- menú por slug
import Pedidos from './pages/Pedidos'

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurantes" element={<Restaurants />} />
        <Route path="/restaurantes/:slug" element={<RestaurantMenu />} />
        <Route path="/pedidos" element={<Pedidos />} />
      </Routes>
    </BrowserRouter>
  )
}
