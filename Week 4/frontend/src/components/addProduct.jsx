import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', name);
    data.append('description', description);
    data.append('price', price);
    data.append('category', category);
    data.append('image', image);

    try {
      const res = await axios.post('http://localhost:3000/add-product', data);
      alert(res.data.message);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Add Product</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col space-y-4">

          
        <div className="flex flex-col">
            <label className="mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-2 rounded bg-white text-black"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Beauty">Beauty</option>
              <option value="Books">Books</option>
              <option value="Grocery">Grocery</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>


          <div className="flex flex-col">
            <label className="mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <button type="submit" className="bg-green-500 hover:bg-green-600 p-2 rounded font-bold cursor-pointer">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;