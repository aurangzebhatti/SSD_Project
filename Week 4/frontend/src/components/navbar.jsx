import {useEffect, useState } from 'react';
import axios from 'axios';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(false);
    const [isLoggedin,setIsLoggedin]=useState(false);
    const displayCart=(e)=>{
        e.stopPropagation();
        setCart(!cart);        
    }
    
    const checkLoginStatus = async () => {
        try {
          const response = await axios.get('http://localhost:3000/checklogin', { withCredentials: true });
          if (response.data.loggedIn) {
            setIsLoggedin(true);
          }
        } catch (err) {
          console.error('Error checking session status', err);
        }
      };
    
      useEffect(() => {
        checkLoginStatus();
      }, []);

      const handleLogout = async () => {
        try {
          await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
          setIsLoggedin(false);
        } catch (err) {
          console.error('Error logging out', err);
        }
      };
      

    useEffect(() => {
        if (!cart) return;

        const handleClickOutside = (event) => {
            if (!event.target.closest(".cart-container") && !event.target.closest(".cart-button")) {
                setCart(false);
            }
        }; 

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [cart]);


   

    return (
        <>
        {cart && <div className="cart-container"> <Cart/></div>}
        <div className="fixed w-full top-0 bg-white shadow bg-gray">
            <nav className="flex justify-between items-center p-4 pt-2">
                <div className="flex items-center space-x-4">
                    <img src="./images/logo.png"
                        alt="Domino's Logo" className="h-15" />
                    <span>Delivering to <strong>SECTOR...</strong></span>
                </div>
                <ul className="flex space-x-6 font-bold ">
                    <li><a>Menu</a></li>
                    <li>Stores</li>
                    <li>Alliances</li>
                    <li>Our Apps</li>
                </ul>
                <div className="flex space-x-4">
                    <img src="./images/cart.png" alt="cart" className="h-9 cursor-pointer" onClick={displayCart}/>
                    {isLoggedin?(<button className="h-10 cursor-pointer" onClick={()=>handleLogout()}>👤 Logout</button>):
                        <button className="h-10 cursor-pointer " onClick={()=>navigate('/signin')}>👤 Login</button>
                    }
                </div>
            </nav>

            <nav className="flex justify-center space-x-6 p-4 pt-0">
                <ul className="flex space-x-6 " id="nav-items">
                    <li><a href="#Electronics" className="nav-link hover:bg-lime-600 hover:text-white p-2 rounded-lg">Electronics</a></li>
                    <li><a href="#Beauty" className="nav-link hover:bg-lime-600 hover:text-white p-2 rounded-lg">Beauty</a></li>
                    <li><a href="#Books" className="nav-link hover:bg-lime-600 hover:text-white p-2 rounded-lg">Books</a></li>
                    <li><a href="#Grocery Items" className="nav-link hover:bg-lime-600 hover:text-white p-2 rounded-lg">Grocery Items</a></li>
                </ul>
            </nav>
        </div>
        </>
    );
};

export default Navbar;