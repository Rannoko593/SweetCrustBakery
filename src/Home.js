import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div>
      <div className="hero-section">
        <div className="container">
          <h1>Welcome to Sweet Crust Bakery</h1>
          <p>Indulge in our freshly baked treats, crafted with love in Maseru, Lesotho.</p>
          <a href="#products" className="btn btn-primary">Explore Our Treats</a>
        </div>
      </div>
      <h2 className="text-center mb-4" id="products"><i className="fas fa-bread-slice me-2"></i>Our Products</h2>
      <div className="row">
        {products.length === 0 ? (
          <p className="text-center">No products available.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="col-md-4 col-sm-6 mb-4">
              <div className="card h-100">
                {product.image_url ? (
                  <img src={`${process.env.REACT_APP_API_URL}${product.image_url}`} className="card-img-top" alt={product.name} />
                ) : (
                  <img src="https://via.placeholder.com/250?text=No+Image" className="card-img-top" alt="No Image" />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description || 'No description available'}</p>
                  <p className="card-text"><strong>Price:</strong> M{product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;