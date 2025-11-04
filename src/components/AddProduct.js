import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [product, setProduct] = useState({ name: '', description: '', price: '' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    if (image) formData.append('image', image);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      navigate('/admin-dashboard');
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" value={product.name} 
            onChange={e => setProduct({...product, name: e.target.value})} required />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={product.description} 
            onChange={e => setProduct({...product, description: e.target.value})} />
        </div>

        <div className="mb-3">
          <label>Price</label>
          <input type="number" className="form-control" step="0.01" value={product.price} 
            onChange={e => setProduct({...product, price: e.target.value})} required />
        </div>

        <div className="mb-3">
          <label>Product Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="mt-2" style={{ width: '150px' }} />}
        </div>

        <button type="submit" className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
