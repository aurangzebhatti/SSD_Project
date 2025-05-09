import { useState, useEffect } from "react";
import axios from "axios";

const Detail = ({ product, close }) => {

    const productId = product.id;
    const productName = product.name;
    const productDescription = product.description;
    const [quantity,setQuantity]=useState(1);
    const [price,setPrice]=useState(null);
    const [totalprice,setTotalPrice]=useState();

    const increase =()=>{
        setQuantity((prev)=>(prev+1)<26?prev+1:prev);
    };

    const decrease=()=>{
        setQuantity((prev)=>prev>1?prev-1:1);
    };

    useEffect(() => {

            setPrice(product.price);
            setTotalPrice(product.price*quantity);
    }, [quantity]);

    const addToCart =()=>{
        axios.post(`http://localhost:3000/add-to-cart`,{Id: productId,Name: productName,Description: productDescription,qty: quantity,Price: price, Total: totalprice},{withCredentials: true})
        .then(response => {
            // Show success message from backend
            alert(response.data?.message); // This is where the server's message gets displayed
        })
        .catch(error => console.error("Error:", error));
    }

    return (

        <div id="modal" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-3/4 h-[90%] rounded-lg shadow-lg p-6 relative flex flex-col justify-center">
                <button onClick={close} className="absolute top-4 right-4 text-gray-600 cursor-pointer hover:text-gray-800">
                    ✖
                </button>

                <div className="flex  ">

                    <div className=" md:w-1/2 p-4 flex justify-between flex-col">
                        <img src={`http://localhost:3000/images/${product.imgaddress}`} alt="Food Item" className="rounded-lg" />
                        <h2 className="text-xl font-bold mt-4">{product.name}</h2>
                        <p className="text-gray-500">{product.description}</p>
                    </div>

                    <div className="md:w-1/2 p-4 flex flex-col justify-between">
                        
                        <div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center">
                                    <button onClick={()=>decrease()} className="bg-lime-600 text-white px-3 py-1 rounded-l cursor-pointer">-</button>
                                    <input type="number" disabled min="1" max="20" step="1" value={quantity} onChange={(e)=>setQuantity(e.target.value)} className="text-center w-10 text-center border border-gray-300 m-2" />
                                    <button onClick={()=>increase()} className="bg-lime-600 text-white px-3 py-1 rounded-r cursor-pointer">+</button>
                                </div>
                                <p className="font-bold text-lg text-lime-600">Rs. {totalprice}</p>
                            </div>

                            <button className="bg-lime-600 text-white w-full py-2 rounded-lg mt-4 cursor-pointer" onClick={()=>addToCart()}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail; 