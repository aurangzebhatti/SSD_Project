import { useEffect, useState } from "react";
import axios from "axios";
import Detail from "./detail";
const categories = ["Electronics", "Beauty", "Books", "Grocery Items"];

const Main = () => { 

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct]=useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/home`)
            .then(response => {
                setProducts(response.data.p);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const showDetails = (detail) => {
        console.log(detail);
        setSelectedProduct(detail);
    };

    const closeDetail = () => {
        setSelectedProduct(null);
    };

    return (
        <>        
        <div className="mt-28">
            {categories.map(category =>
                <section id={category} className="p-6 scroll-mt-28">
                    <h2 className="text-2xl font-bold pb-2 mb-4 border-b-2 border-black">{category}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                        {products.filter(p => p.category === category)
                            .map(p =>
                                <div className="bg-white shadow rounded-lg overflow-hidden bg-lime-50">
                                    <img src={`http://localhost:3000/images/${p.imgaddress}`} alt="error to load image" className="w-full h-55 object-cover" />
                                    <div className="p-4">
                                        <h3 className="text-lg text-blue-600 font-bold">{p.name}</h3>
                                        <p>{p.description}</p>
                                        <p className="text-lime-600"><strong className="text-black">Starting: </strong>Rs. {p.price}</p>

                                        <button onClick={()=>showDetails(p)} className="bg-lime-600 w-full font-bold p-1.5 mt-2 rounded-xl text-white cursor-pointer" value={p.id}>Add To
                                            Cart</button>
                                    </div>
                                </div>

                            )}
                    </div>
                </section>
            )};
            
        </div>
        {selectedProduct && <Detail product={selectedProduct} close={closeDetail}/>}
        </>
    );
};

export default Main;