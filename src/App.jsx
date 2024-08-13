import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Landing/Home/Home';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import ContactUs from './Components/ContactUs/ContactUs';
import Product from './Components/Product/Product';

function App() {
  return (
    <>
      {/* <Router>
        <Navbar />
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
        </Routes>
        <Footer />
      </Router> */}

      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/product" exact element={<Product />} />
          <Route path="/contactus" exact element={<ContactUs />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
