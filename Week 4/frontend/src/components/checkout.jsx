import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    name: '',
    city: '',
    address: '',
    paymentMethod: '',
  });

  const [subTotal,setSubTotal]=useState(0);
  const [total,setTotal]=useState(0);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    // Fetch cart data from server
    axios.get('http://localhost:3000/get-cart', { withCredentials: true })
      .then(res => setCartData(res.data.cartData))
      .catch(err => console.error("Error loading cart:", err));
  }, []);

  useEffect(() => {
    const subtotal = cartData.reduce((acc, item) => acc + item.total, 0);
    const deliveryCharges = 150; // Example static delivery charge
    const tax = subtotal * 0.15; // 15% tax
    const grandTotal = subtotal + deliveryCharges + tax;

    setSubTotal(subtotal);
    setTotal(grandTotal);
}, [cartData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    try {
      const orderRes = await axios.post('http://localhost:3000/create-order', {
        ...form,
        total: total,
        cart: cartData
      }, { withCredentials: true });

      navigate('/home');
      // Optionally clear cart or redirect
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Something went wrong during checkout.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Checkout Total {total}</h2>
        <form onSubmit={handleCheckout} className="flex flex-col space-y-4">

          <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange} className="p-2 bg-white text-black rounded" />
          <input name="name" type="text" required placeholder="Full Name" value={form.name} onChange={handleChange} className="p-2 bg-white text-black rounded" />
          <input name="address" type="text" required placeholder="Street Address" value={form.address} onChange={handleChange} className="p-2 bg-white text-black rounded" />
          <input name="city" type="text" required placeholder="City" value={form.city} onChange={handleChange} className="p-2 bg-white text-black rounded" />

          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} required className="p-2 bg-white text-black rounded">
            <option value="">Select Payment Method</option>
            <option value="credit">Credit Card</option>
            <option value="cash">Cash on Delivery</option>
          </select>

          <button type="submit" className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold">Order Place</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
