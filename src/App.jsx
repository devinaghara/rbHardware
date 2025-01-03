import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Landing/Home/Home';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import ContactUs from './Components/ContactUs/ContactUs';
import Product from './Components/Product/Product';
import ProductDetailPage from './Components/Product/ProductDetailPage';
import CartPage from './Components/CartPage/CartPage';
import DownloadPage from './Components/Download/DownloadPage';
import ProfilePage from './Components/Landing/ProfilePage';
import AddressSelectPage from './Components/Address/AddressSelectPage';
import PaymentPage from './Components/Payment/PaymentPage';
import WishlistPage from './Components/WishList/WishlistPage';
import OrderPage from './Components/Orders/OrderPage';
import OTPVerification from './Components/UserVerification/OTPVerification';
import ResetPassword from './Components/UserVerification/ResetPassword';
import { AuthProvider } from './Components/Contexts/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/product" exact element={<Product />} />
            <Route path="/contactus" exact element={<ContactUs />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/download" element={<DownloadPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/address" element={<AddressSelectPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
