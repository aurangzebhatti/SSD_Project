import './App.css'
import Navbar from './components/navbar';
import Main from './components/main';
import AddProduct from './components/addProduct';
import Signup from './components/signup';
import Signin from './components/signin';
import Verify from './components/verify';
import VerifyLogin from './components/verifyLogin.jsx';
import Checkout from './components/checkout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
   
  return (

    <Router>
      <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/loginVerify" element={<VerifyLogin />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/home" element={<><Navbar/><Main/></>} />
      <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  )
}

export default App
