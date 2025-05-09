import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Cart=()=>{

    const navigate = useNavigate();
    const [cartData,setCartData]=useState([]);
    const [subTotal,setSubTotal]=useState(0);
    const [total,setTotal]=useState(0);

    const goCheckout=()=>{
        if(cartData.length>0){
            navigate('/checkout');
        }
    }
    
    const increase = (index) => {
        setCartData(prv=>(            
            prv.map(((item,i)=>(
                index ===i?{...item,
                    quantity: item.quantity+1,
                    total: item.pricePerItem*(item.quantity+1)
                }
                :
                item
            )))            
        ))        
    };

    const decrease = (index) => {
        setCartData(prv=>(            
            prv.map(((item,i)=>(
                index ===i?{...item,
                    quantity: item.quantity>1? item.quantity-1:item.quantity,
                    total: item.quantity>1? item.pricePerItem*(item.quantity-1): item.pricePerItem
                }
                :
                item
            )))            
        ))        
    };

    useEffect(()=>{
        if (cartData.length > 0) {
            axios.put(`http://localhost:3000/update-cart`,{cart: cartData},{withCredentials: true})
            // .then(response=>console.log(response.data))
            .catch(error=>console.error("Error to update: "+error))}
    },[cartData])

    const removeItem=(e,id)=>{
        e.stopPropagation();
        // console.log(id);
        setCartData((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== id);
    
            // Ensure API is called even if cart is empty
            axios.put(`http://localhost:3000/update-cart`, { cart: updatedCart }, { withCredentials: true })
                // .then(response => setCartData(response.data.cart))
                .catch(error => console.error("Error updating cart:", error));
    
            return updatedCart;
        });
    };


    useEffect(()=>{
        axios.get(`http://localhost:3000/get-cart`,{ withCredentials: true })
            .then(response=>{setCartData(response.data.cartData)
            })
            .catch(error=> console.error("Error to fetching: ",error));
    },[]);

    useEffect(() => {
        const subtotal = cartData.reduce((acc, item) => acc + item.total, 0);
        const deliveryCharges = 150; // Example static delivery charge
        const tax = subtotal * 0.15; // 15% tax
        const grandTotal = subtotal + deliveryCharges + tax;

        setSubTotal(subtotal);
        setTotal(grandTotal);
    }, [cartData]);

    return(

        <div className="fixed right-2 top-10 border-2 border-black w-1/3 bg-white shadow-lg rounded-lg p-4 z-50">
        <h2 className="text-lg font-bold mb-4">Your Cart</h2>

        <div className="max-h-64 overflow-y-auto">

        {cartData.map((data,index)=>(       
            <div className="border-b py-4">
                <div className="flex items-start space-x-4">   
                            <div className="flex-1">
                            <h3 className="font-bold">{data.name}</h3>
                            <p className="text-sm text-gray-500">{data.description}</p>
                            </div>
                    <div className="text-right">
                        <p className="font-bold">Rs. {data.total}</p>
                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <div>
                        <button onClick={()=>decrease(index)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">-</button>
                        <input type="number" min="1" disabled step="1" value={data.quantity} className="w-8 text-center mx-1 border rounded" />
                        <button onClick={()=>increase(index)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">+</button>
                    </div>
                    <div>
                        <button onClick={(e)=>removeItem(e,data.id)} className="cursor-pointer bg-lime-600 text-white px-2 py-1 rounded">🗑</button>
                    </div>
                </div>
            </div>
        ))}
        
        </div>

        <div className="pt-4">
            <p className="flex justify-between text-sm"><span>Subtotal</span> <span>Rs. {subTotal}</span></p>
            <p className="flex justify-between text-sm"><span>Delivery Charges</span> <span>Rs. 150</span></p>
            <p className="flex justify-between text-sm"><span>Tax (15%)</span> <span>Rs. {subTotal*0.15}</span></p>
            <p className="flex justify-between font-bold text-lg mt-2"><span>Grand Total</span> <span>Rs. {total}</span></p>
        </div>
        <button onClick={()=>goCheckout()} className="bg-lime-600 text-white w-full py-2 rounded-lg mt-4 cursor-pointer">Checkout</button>
    </div>
    );
}

export default Cart;