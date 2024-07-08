import { useState, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom' 
import './App.css'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Home from './pages/user/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NavBar from './components/NavBar'
import {AuthProvider } from './context/authContext';

function App() {

  return (
    <AuthProvider>
    <Router>
    <NavBar />
      <Routes>
        {/* <Route path="/product" exact component={ProductList} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
    </AuthProvider>
  )
}

export default App;
